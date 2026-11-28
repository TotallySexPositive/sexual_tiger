import { SlashCommandBuilder } from 'discord.js';
import type { ChatInputCommandInteraction, ButtonInteraction, ModalSubmitInteraction } from 'discord.js';
import * as DAL from "../../dal";
import {
    buildPageJumpModal,
    buildPaginationRow,
    buildSearchModal,
    buildSortRow,
    buildTableContent,
    getState,
    sendOrUpdatePaginatedMessage,
    truncateText,
} from "../../table_ui";
import type { PaginatedInteraction, SortButtonConfig, SortDirection, TableState } from "../../table_ui";

type SortField = 'song_id' | 'name' | 'duration' | 'num_plays';

declare const global: any;
if (!global.searchStates) {
    global.searchStates = new Map<string, TableState<SortField>>();
}

const DEFAULT_SORT_DIRECTION: Record<SortField, SortDirection> = {
    song_id: 'ASC',
    name: 'ASC',
    duration: 'ASC',
    num_plays: 'DESC',
};

const SORT_BUTTONS: SortButtonConfig<SortField>[] = [
    { customId: 'search_sort_id', field: 'song_id', label: 'Sort by ID' },
    { customId: 'search_sort_name', field: 'name', label: 'Sort by Name' },
    { customId: 'search_sort_duration', field: 'duration', label: 'Sort by Duration' },
    { customId: 'search_sort_plays', field: 'num_plays', label: 'Sort by Plays' },
];

const SORT_BUTTON_MAP = new Map<string, SortField>(
    SORT_BUTTONS.map(({ customId, field }) => [customId, field])
);

const TABLE_OPTIONS = {
    skinny: true,
    intersectionCharacter: "+",
    columns: [
        { field: "song_id", name: "ID" },
        { field: "name", name: "Name" },
        { field: "duration", name: "Duration" },
        { field: "num_plays", name: "Plays" }
    ],
};

function getSearchResults(searchTerm: string | null, sortField: SortField, sortDirection: SortDirection): any[] {
    if (searchTerm && searchTerm.trim() !== "") {
        const result = (DAL.searchForSongs as any)(searchTerm, null, sortField, sortDirection);
        if (result.err) {
            console.log(result.err);
            return [];
        }
        return result.songs || [];
    }

    const result = (DAL.getAllSongs as any)(sortField, sortDirection);
    if (result.err) {
        console.log(result.err);
        return [];
    }
    return result.songs || [];
}

async function renderSearch(
    interaction: PaginatedInteraction,
    searchTerm: string | null,
    page: number,
    sortField: SortField,
    sortDirection: SortDirection
) {
    const songs = getSearchResults(searchTerm, sortField, sortDirection);
    const { content: tableContent, page: clampedPage, totalPages } = buildTableContent(
        songs,
        page,
        TABLE_OPTIONS,
        song => ({
            song_id: song.song_id,
            name: truncateText(song.name ?? ""),
            duration: song.duration ?? 0,
            num_plays: song.num_plays ?? 0,
        })
    );

    const components = [
        buildPaginationRow('search', clampedPage, totalPages),
        buildSortRow(SORT_BUTTONS, 'search_open_modal', sortField, sortDirection),
    ];

    const state: TableState<SortField> = {
        searchTerm,
        page: clampedPage,
        totalPages,
        sortField,
        sortDirection,
    };

    await sendOrUpdatePaginatedMessage(interaction, global.searchStates, state, tableContent, components);
}

export const data = new SlashCommandBuilder()
    .setName('search')
    .setDescription("Search for songs in the database.")
    .addStringOption(opt => opt.setName('song').setDescription('Song name to search for (partial match)').setRequired(false));

export async function execute(interaction: ChatInputCommandInteraction) {
    const searchTerm = interaction.options.getString('song');
    await renderSearch(interaction, searchTerm, 1, 'song_id', 'ASC');
}

export async function handleSearchButton(interaction: ButtonInteraction) {
    const state = getState<SortField>(global.searchStates, interaction);

    if (!state) {
        await interaction.reply({ content: "No active search. Use /search to start one.", ephemeral: true });
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
            case 'search_first':
                newPage = 1;
                break;
            case 'search_prev':
                newPage = Math.max(1, state.page - 1);
                break;
            case 'search_next':
                newPage = state.page + 1;
                break;
            case 'search_last':
                newPage = Number.MAX_SAFE_INTEGER;
                break;
            case 'search_pageinfo':
                await interaction.showModal(
                    buildPageJumpModal('search_page_modal', 'search_page_input', state.page, state.totalPages)
                );
                return;
            case 'search_open_modal':
                await interaction.showModal(
                    buildSearchModal(
                        'search_modal',
                        'Search Songs',
                        'search_input',
                        'Song Name',
                        'Enter a partial song name...'
                    )
                );
                return;
            default:
                return;
        }
    }

    await renderSearch(interaction, state.searchTerm, newPage, newSortField, newSortDirection);
}

export async function handleSearchModal(interaction: ModalSubmitInteraction) {
    const state = getState<SortField>(global.searchStates, interaction);

    if (interaction.customId === 'search_page_modal') {
        if (!state) {
            await interaction.reply({ content: "No active search. Use /search to start one.", ephemeral: true });
            return;
        }

        const rawPage = interaction.fields.getTextInputValue('search_page_input').trim();
        if (!/^\d+$/.test(rawPage)) {
            await interaction.reply({ content: "Please enter a valid positive page number.", ephemeral: true });
            return;
        }

        const targetPage = Number.parseInt(rawPage, 10);
        if (targetPage < 1) {
            await interaction.reply({ content: "Please enter a valid positive page number.", ephemeral: true });
            return;
        }

        await renderSearch(interaction, state.searchTerm, targetPage, state.sortField, state.sortDirection);
        return;
    }

    const searchTerm = interaction.fields.getTextInputValue('search_input').trim() || null;
    const sortField = state?.sortField ?? 'song_id';
    const sortDirection = state?.sortDirection ?? 'ASC';

    await renderSearch(interaction, searchTerm, 1, sortField, sortDirection);
}
