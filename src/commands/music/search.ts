import {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    LabelBuilder,
    TextInputBuilder,
    TextInputStyle,
} from 'discord.js';
import type { ChatInputCommandInteraction, ButtonInteraction, ModalSubmitInteraction } from 'discord.js';
import asciitable from 'asciitable';
import * as DAL from "../../dal";

type SortField = 'song_id' | 'name' | 'duration' | 'num_plays';
type SortDirection = 'ASC' | 'DESC';

interface SearchState {
    searchTerm: string | null;
    page: number;
    totalPages: number;
    sortField: SortField;
    sortDirection: SortDirection;
}

declare const global: any;
if (!global.searchStates) {
    global.searchStates = new Map<string, SearchState>();
}

const PAGE_SIZE = 20;
const DISCORD_MAX_CHARS = 2000;
const NAME_MAX_LEN = 45;

const DEFAULT_SORT_DIRECTION: Record<SortField, SortDirection> = {
    song_id: 'ASC',
    name: 'ASC',
    duration: 'ASC',
    num_plays: 'DESC',
};

const SORT_BUTTONS: { customId: string; field: SortField; label: string }[] = [
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

function truncateName(name: string): string {
    if (name.length > NAME_MAX_LEN) {
        return name.substring(0, NAME_MAX_LEN - 3) + "...";
    }
    return name;
}

function buildTableContent(songs: any[], page: number): { content: string; page: number; totalPages: number } {
    const totalPages = Math.max(1, Math.ceil(songs.length / PAGE_SIZE));
    const clampedPage = Math.min(Math.max(1, page), totalPages);
    const startIdx = (clampedPage - 1) * PAGE_SIZE;
    const pageRows = songs.slice(startIdx, startIdx + PAGE_SIZE).map(song => ({
        song_id: song.song_id,
        name: truncateName(song.name ?? ""),
        duration: song.duration ?? 0,
        num_plays: song.num_plays ?? 0,
    }));

    let table = asciitable(TABLE_OPTIONS, pageRows);
    while (table.length + 6 > DISCORD_MAX_CHARS && pageRows.length > 1) {
        pageRows.pop();
        table = asciitable(TABLE_OPTIONS, pageRows);
    }

    return {
        content: "```" + table + "```",
        page: clampedPage,
        totalPages,
    };
}

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

function buildPaginationRow(page: number, totalPages: number): ActionRowBuilder<ButtonBuilder> {
    const firstBtn = new ButtonBuilder()
        .setCustomId('search_first')
        .setLabel('<<')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(page <= 1);

    const prevBtn = new ButtonBuilder()
        .setCustomId('search_prev')
        .setLabel('<')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(page <= 1);

    const pageInfoBtn = new ButtonBuilder()
        .setCustomId('search_pageinfo')
        .setLabel(`${page}/${totalPages}`)
        .setStyle(ButtonStyle.Primary);

    const nextBtn = new ButtonBuilder()
        .setCustomId('search_next')
        .setLabel('>')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(page >= totalPages);

    const lastBtn = new ButtonBuilder()
        .setCustomId('search_last')
        .setLabel('>>')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(page >= totalPages);

    return new ActionRowBuilder<ButtonBuilder>().addComponents(firstBtn, prevBtn, pageInfoBtn, nextBtn, lastBtn);
}

function buildSortRow(sortField: SortField, sortDirection: SortDirection): ActionRowBuilder<ButtonBuilder> {
    const dirIcon = sortDirection === 'ASC' ? '▲' : '▼';

    const sortButtons = SORT_BUTTONS.map(({ customId, field, label }) => {
        const isActive = sortField === field;
        return new ButtonBuilder()
            .setCustomId(customId)
            .setLabel(isActive ? `${label} ${dirIcon}` : label)
            .setStyle(isActive ? ButtonStyle.Success : ButtonStyle.Secondary);
    });

    const searchBtn = new ButtonBuilder()
        .setCustomId('search_open_modal')
        .setLabel('Search')
        .setStyle(ButtonStyle.Primary);

    return new ActionRowBuilder<ButtonBuilder>().addComponents(...sortButtons, searchBtn);
}

function buildSearchModal(): ModalBuilder {
    const input = new TextInputBuilder()
        .setCustomId('search_input')
        .setPlaceholder('Enter a partial song name...')
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

    const label = new LabelBuilder()
        .setLabel('Song Name')
        .setTextInputComponent(input);

    return new ModalBuilder()
        .setCustomId('search_modal')
        .setTitle('Search Songs')
        .addLabelComponents(label);
}

function buildPageJumpModal(currentPage: number, totalPages: number): ModalBuilder {
    const input = new TextInputBuilder()
        .setCustomId('search_page_input')
        .setPlaceholder(`1 - ${totalPages}`)
        .setValue(String(currentPage))
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const label = new LabelBuilder()
        .setLabel(`Page Number (1-${totalPages})`)
        .setTextInputComponent(input);

    return new ModalBuilder()
        .setCustomId('search_page_modal')
        .setTitle('Jump to Page')
        .addLabelComponents(label);
}

type SearchInteraction = ChatInputCommandInteraction | ButtonInteraction | ModalSubmitInteraction;

function getFallbackKey(interaction: SearchInteraction): string {
    return `${interaction.guildId}:${interaction.user.id}`;
}

function getState(interaction: ButtonInteraction | ModalSubmitInteraction): SearchState | undefined {
    if (interaction.message?.id && global.searchStates.has(interaction.message.id)) {
        return global.searchStates.get(interaction.message.id);
    }
    return global.searchStates.get(getFallbackKey(interaction));
}

async function renderSearch(
    interaction: SearchInteraction,
    searchTerm: string | null,
    page: number,
    sortField: SortField,
    sortDirection: SortDirection
) {
    const songs = getSearchResults(searchTerm, sortField, sortDirection);
    const { content: tableContent, page: clampedPage, totalPages } = buildTableContent(songs, page);
    const components = [
        buildPaginationRow(clampedPage, totalPages),
        buildSortRow(sortField, sortDirection),
    ];

    const state: SearchState = {
        searchTerm,
        page: clampedPage,
        totalPages,
        sortField,
        sortDirection,
    };

    if (interaction.isButton() || (interaction.isModalSubmit() && interaction.isFromMessage())) {
        await interaction.update({ content: tableContent, components });
        global.searchStates.set(interaction.message.id, state);
        return;
    }

    const response = await interaction.reply({
        content: tableContent,
        components,
        ephemeral: true,
        withResponse: true,
    });
    const stateKey = response.resource?.message?.id || getFallbackKey(interaction);
    global.searchStates.set(stateKey, state);
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
    const state = getState(interaction);

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
                await interaction.showModal(buildPageJumpModal(state.page, state.totalPages));
                return;
            case 'search_open_modal':
                await interaction.showModal(buildSearchModal());
                return;
            default:
                return;
        }
    }

    await renderSearch(interaction, state.searchTerm, newPage, newSortField, newSortDirection);
}

export async function handleSearchModal(interaction: ModalSubmitInteraction) {
    const state = getState(interaction);

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
