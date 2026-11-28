import { ActionRowBuilder } from 'discord.js';
import type {
    ChatInputCommandInteraction,
    ButtonInteraction,
    ModalSubmitInteraction,
    StringSelectMenuInteraction,
    MessageActionRowComponentBuilder,
} from 'discord.js';
import * as DAL from "../../../dal";
import {
    buildPageJumpModal,
    buildPaginationRow,
    buildSearchModal,
    buildSelectRow,
    buildSortRow,
    buildTableContent,
    getState,
    sendOrUpdatePaginatedMessage,
    truncateText,
} from "../../../table_ui";
import type { PaginatedInteraction, SortButtonConfig, SortDirection, TableState } from "../../../table_ui";
import { playPlaylistByIdentifier } from "./play";

type PlaylistSortField = 'playlist_id' | 'name' | 'num_songs';

declare const global: any;
if (!global.playlistListStates) {
    global.playlistListStates = new Map<string, TableState<PlaylistSortField>>();
}

const DEFAULT_SORT_DIRECTION: Record<PlaylistSortField, SortDirection> = {
    playlist_id: 'ASC',
    name: 'ASC',
    num_songs: 'DESC',
};

const SORT_BUTTONS: SortButtonConfig<PlaylistSortField>[] = [
    { customId: 'playlist_list_sort_id', field: 'playlist_id', label: 'Sort by ID' },
    { customId: 'playlist_list_sort_name', field: 'name', label: 'Sort by Name' },
    { customId: 'playlist_list_sort_songs', field: 'num_songs', label: 'Sort by # Songs' },
];

const SORT_BUTTON_MAP = new Map<string, PlaylistSortField>(
    SORT_BUTTONS.map(({ customId, field }) => [customId, field])
);

const PLAYLIST_TABLE_OPTIONS = {
    skinny: true,
    intersectionCharacter: "+",
    columns: [
        { field: "playlist_id", name: "ID" },
        { field: "name", name: "Name" },
        { field: "num_songs", name: "# Songs" }
    ],
};

function getPlaylistResults(searchTerm: string | null, sortField: PlaylistSortField, sortDirection: SortDirection): any[] {
    if (searchTerm && searchTerm.trim() !== "") {
        const result = (DAL.searchForPlaylists as any)(searchTerm, null, sortField, sortDirection);
        if (result.err) {
            console.log(result.err);
            return [];
        }
        return result.playlists || [];
    }

    const result = (DAL.getPlaylists as any)(sortField, sortDirection);
    if (result.err) {
        console.log(result.err);
        return [];
    }
    return result.playlists || [];
}

async function renderPlaylistList(
    interaction: PaginatedInteraction,
    searchTerm: string | null,
    page: number,
    sortField: PlaylistSortField,
    sortDirection: SortDirection
) {
    const playlists = getPlaylistResults(searchTerm, sortField, sortDirection);
    const { content: tableContent, page: clampedPage, totalPages, displayedItems } = buildTableContent(
        playlists,
        page,
        PLAYLIST_TABLE_OPTIONS,
        playlist => ({
            playlist_id: playlist.playlist_id,
            name: truncateText(playlist.name ?? ""),
            num_songs: playlist.num_songs ?? 0,
        })
    );

    const components: ActionRowBuilder<MessageActionRowComponentBuilder>[] = [
        buildPaginationRow('playlist_list', clampedPage, totalPages),
        buildSortRow(SORT_BUTTONS, 'playlist_list_open_modal', sortField, sortDirection),
    ];

    if (displayedItems.length > 0) {
        components.push(
            buildSelectRow(
                'playlist_list_select',
                'Select a playlist to play...',
                displayedItems.map(playlist => ({
                    label: playlist.name || `Playlist ${playlist.playlist_id}`,
                    description: `ID: ${playlist.playlist_id} | ${playlist.num_songs ?? 0} songs`,
                    value: String(playlist.playlist_id),
                }))
            )
        );
    }

    const state: TableState<PlaylistSortField> = {
        searchTerm,
        page: clampedPage,
        totalPages,
        sortField,
        sortDirection,
    };

    await sendOrUpdatePaginatedMessage(interaction, global.playlistListStates, state, tableContent, components);
}

export async function execute(interaction: ChatInputCommandInteraction) {
    const searchTerm = interaction.options.getString('playlist');
    await renderPlaylistList(interaction, searchTerm, 1, 'playlist_id', 'ASC');
}

export async function handlePlaylistListButton(interaction: ButtonInteraction) {
    const state = getState<PlaylistSortField>(global.playlistListStates, interaction);

    if (!state) {
        await interaction.reply({ content: "No active playlist list. Use /playlist list to start one.", ephemeral: true });
        return;
    }

    let newPage = state.page;
    let newSortField = state.sortField;
    let newSortDirection = state.sortDirection;

    const targetSortField = SORT_BUTTON_MAP.get(interaction.customId);
    if (targetSortField) {
        if (state.sortField === targetSortField) {
            newSortDirection = state.sortDirection === 'ASC' ? 'DESC' : 'ASC';
        } else {
            newSortField = targetSortField;
            newSortDirection = DEFAULT_SORT_DIRECTION[targetSortField];
        }
        newPage = 1;
    } else {
        switch (interaction.customId) {
            case 'playlist_list_first':
                newPage = 1;
                break;
            case 'playlist_list_prev':
                newPage = Math.max(1, state.page - 1);
                break;
            case 'playlist_list_next':
                newPage = state.page + 1;
                break;
            case 'playlist_list_last':
                newPage = Number.MAX_SAFE_INTEGER;
                break;
            case 'playlist_list_pageinfo':
                await interaction.showModal(
                    buildPageJumpModal('playlist_list_page_modal', 'playlist_list_page_input', state.page, state.totalPages)
                );
                return;
            case 'playlist_list_open_modal':
                await interaction.showModal(
                    buildSearchModal(
                        'playlist_list_modal',
                        'Search Playlists',
                        'playlist_list_search_input',
                        'Playlist Name',
                        'Enter a partial playlist name...'
                    )
                );
                return;
            default:
                return;
        }
    }

    await renderPlaylistList(interaction, state.searchTerm, newPage, newSortField, newSortDirection);
}

export async function handlePlaylistListSelect(interaction: StringSelectMenuInteraction) {
    const selectedPlaylistId = interaction.values[0];
    if (!selectedPlaylistId) return;
    await playPlaylistByIdentifier(interaction, selectedPlaylistId);
}

export async function handlePlaylistListModal(interaction: ModalSubmitInteraction) {
    const state = getState<PlaylistSortField>(global.playlistListStates, interaction);

    if (interaction.customId === 'playlist_list_page_modal') {
        if (!state) {
            await interaction.reply({ content: "No active playlist list. Use /playlist list to start one.", ephemeral: true });
            return;
        }

        const rawPage = interaction.fields.getTextInputValue('playlist_list_page_input').trim();
        if (!/^\d+$/.test(rawPage)) {
            await interaction.reply({ content: "Please enter a valid positive page number.", ephemeral: true });
            return;
        }

        const targetPage = Number.parseInt(rawPage, 10);
        if (targetPage < 1) {
            await interaction.reply({ content: "Please enter a valid positive page number.", ephemeral: true });
            return;
        }

        await renderPlaylistList(interaction, state.searchTerm, targetPage, state.sortField, state.sortDirection);
        return;
    }

    const searchTerm = interaction.fields.getTextInputValue('playlist_list_search_input').trim() || null;
    const sortField = state?.sortField ?? 'playlist_id';
    const sortDirection = state?.sortDirection ?? 'ASC';

    await renderPlaylistList(interaction, searchTerm, 1, sortField, sortDirection);
}
