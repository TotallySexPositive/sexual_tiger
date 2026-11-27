import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import type { ChatInputCommandInteraction, ButtonInteraction, ModalSubmitInteraction } from 'discord.js';
import * as DAL from "../../dal";

interface SearchState {
    searchTerm: string | null;
    page: number;
    sortField: string;
    paginationRowMessageId: string;
    sortRowMessageId: string;
}

declare const global: any;
if (!global.searchStates) {
    global.searchStates = new Map<string, SearchState>();
}

const PAGE_CHAR_LIMIT = 2000;
const NAME_MAX_LEN = 45;

function truncateName(name: string): string {
    if (name.length > NAME_MAX_LEN) {
        return name.substring(0, NAME_MAX_LEN - 3) + "...";
    }
    return name;
}

function buildTableHeader(): string {
    const idCol = "Id".padEnd(5);
    const nameCol = "Name".padEnd(NAME_MAX_LEN + 2);
    const durCol = "Duration".padStart(9);
    const playsCol = "Plays".padStart(6);
    return `| ${idCol}| ${nameCol}| ${durCol} | ${playsCol} |`;
}

function buildTableSeparator(): string {
    return `|-----+${"-".repeat(NAME_MAX_LEN + 2)}+---------+--------|`;
}

function buildTableRow(song: any): string {
    const idStr = String(song.song_id).padEnd(5);
    const nameStr = truncateName(song.name).padEnd(NAME_MAX_LEN + 1);
    const durStr = String(song.duration ?? 0).padStart(9);
    const playsStr = String(song.num_plays ?? 0).padStart(6);
    return `| ${idStr}| ${nameStr}| ${durStr} | ${playsStr} |`;
}

function sortSongs(songs: any[], field: string): any[] {
    const sorted = [...songs];
    switch (field) {
        case 'song_id':
            sorted.sort((a, b) => a.song_id - b.song_id);
            break;
        case 'name':
            sorted.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'duration':
            sorted.sort((a, b) => (a.duration ?? 0) - (b.duration ?? 0));
            break;
        case 'num_plays':
            sorted.sort((a, b) => (a.num_plays ?? 0) - (b.num_plays ?? 0));
            break;
    }
    return sorted;
}

function paginateSongs(songs: any[]): { pages: string[], totalPages: number } {
    const header = buildTableHeader();
    const separator = buildTableSeparator();
    const pages: string[] = [];

    if (songs.length === 0) {
        pages.push(`${header}\n${separator}`);
        return { pages, totalPages: 1 };
    }

    let currentPage = `${header}\n${separator}`;
    let currentRows = 0;

    for (const song of songs) {
        const row = buildTableRow(song);
        const testPage = currentPage + "\n" + row;

        if (testPage.length > PAGE_CHAR_LIMIT && currentRows > 0) {
            pages.push(currentPage);
            currentPage = `${header}\n${separator}\n${row}`;
            currentRows = 1;
        } else {
            currentPage = testPage;
            currentRows++;
        }
    }

    if (currentPage.length > 0) {
        pages.push(currentPage);
    }

    return { pages, totalPages: pages.length };
}

async function getSearchResults(searchTerm: string | null): Promise<any[]> {
    if (searchTerm && searchTerm.trim() !== "") {
        const result = DAL.searchForSongs(searchTerm, 1000) as any;
        if (result.err) {
            console.log(result.err);
            return [];
        }
        return result.songs || [];
    } else {
        const result = DAL.getAllSongs() as any;
        if (result.err) {
            console.log(result.err);
            return [];
        }
        return result.songs || [];
    }
}

function buildPaginationRow(page: number, totalPages: number): ActionRowBuilder<ButtonBuilder>[] {
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
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true);

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

    return [new ActionRowBuilder<ButtonBuilder>().addComponents(firstBtn, prevBtn, pageInfoBtn, nextBtn, lastBtn)];
}

function buildSortRow(sortField: string): ActionRowBuilder<ButtonBuilder>[] {
    const idBtn = new ButtonBuilder()
        .setCustomId('search_sort_id')
        .setLabel('Sort by ID')
        .setStyle(sortField === 'song_id' ? ButtonStyle.Success : ButtonStyle.Secondary);

    const nameBtn = new ButtonBuilder()
        .setCustomId('search_sort_name')
        .setLabel('Sort by Name')
        .setStyle(sortField === 'name' ? ButtonStyle.Success : ButtonStyle.Secondary);

    const durBtn = new ButtonBuilder()
        .setCustomId('search_sort_duration')
        .setLabel('Sort by Duration')
        .setStyle(sortField === 'duration' ? ButtonStyle.Success : ButtonStyle.Secondary);

    const playsBtn = new ButtonBuilder()
        .setCustomId('search_sort_plays')
        .setLabel('Sort by Plays')
        .setStyle(sortField === 'num_plays' ? ButtonStyle.Success : ButtonStyle.Secondary);

    const searchBtn = new ButtonBuilder()
        .setCustomId('search_open_modal')
        .setLabel('Search')
        .setStyle(ButtonStyle.Primary);

    return [new ActionRowBuilder<ButtonBuilder>().addComponents(idBtn, nameBtn, durBtn, playsBtn, searchBtn)];
}

function buildSearchModal(): ModalBuilder {
    const input = new TextInputBuilder()
        .setCustomId('search_input')
        .setLabel('Song Name')
        .setPlaceholder('Enter a partial song name...')
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

    const row = new ActionRowBuilder<TextInputBuilder>().addComponents(input);

    const modal = new ModalBuilder()
        .setCustomId('search_modal')
        .setTitle('Search Songs');

    modal.addComponents(row);
    return modal;
}

type SearchInteraction = ChatInputCommandInteraction | ButtonInteraction | ModalSubmitInteraction;

async function renderSearch(interaction: SearchInteraction, searchTerm: string | null, page: number, sortField: string) {
    const key = `${interaction.guildId}:${interaction.user.id}`;

    let songs = await getSearchResults(searchTerm);
    songs = sortSongs(songs, sortField);

    const { pages, totalPages } = paginateSongs(songs);

    if (page > totalPages) page = totalPages;
    if (page < 1) page = 1;

    const tableContent = "```" + pages[page - 1] + "```";
    const paginationRow = buildPaginationRow(page, totalPages);
    const sortRow = buildSortRow(sortField);

    let paginationRowMessageId = "";
    let sortRowMessageId = "";

    if (interaction.replied || interaction.deferred) {
        await interaction.editReply({ content: tableContent, components: [] });

        const existingState = global.searchStates.get(key);
        if (existingState && existingState.paginationRowMessageId) {
            try {
                const channel = interaction.channel;
                if (channel) {
                    const pagMsg = await channel.messages.fetch(existingState.paginationRowMessageId);
                    await pagMsg.edit({ components: paginationRow });
                    paginationRowMessageId = existingState.paginationRowMessageId;

                    if (existingState.sortRowMessageId) {
                        const sortMsg = await channel.messages.fetch(existingState.sortRowMessageId);
                        await sortMsg.edit({ components: sortRow });
                        sortRowMessageId = existingState.sortRowMessageId;
                    } else {
                        throw new Error("No sort row message id");
                    }
                } else {
                    throw new Error("No channel");
                }
            } catch (e) {
                console.log("Failed to edit existing messages:", e);
                const pagSent = await interaction.followUp({ components: paginationRow, ephemeral: true });
                const sortSent = await interaction.followUp({ components: sortRow, ephemeral: true });
                paginationRowMessageId = pagSent.id;
                sortRowMessageId = sortSent.id;
            }
        } else {
            const pagSent = await interaction.followUp({ components: paginationRow, ephemeral: true });
            const sortSent = await interaction.followUp({ components: sortRow, ephemeral: true });
            paginationRowMessageId = pagSent.id;
            sortRowMessageId = sortSent.id;
        }
    } else {
        await interaction.reply({ content: tableContent, components: [], ephemeral: true });
        const pagSent = await interaction.followUp({ components: paginationRow, ephemeral: true });
        const sortSent = await interaction.followUp({ components: sortRow, ephemeral: true });
        paginationRowMessageId = pagSent.id;
        sortRowMessageId = sortSent.id;
    }

    global.searchStates.set(key, {
        searchTerm,
        page,
        sortField,
        paginationRowMessageId,
        sortRowMessageId
    });
}

export const data = new SlashCommandBuilder()
    .setName('search')
    .setDescription("Search for songs in the database.")
    .addStringOption(opt => opt.setName('song').setDescription('Song name to search for (partial match)').setRequired(false));

export async function execute(interaction: ChatInputCommandInteraction) {
    const searchTerm = interaction.options.getString('song');
    await renderSearch(interaction, searchTerm, 1, 'song_id');
}

export async function handleSearchButton(interaction: ButtonInteraction) {
    const key = `${interaction.guildId}:${interaction.user.id}`;
    const state = global.searchStates.get(key);

    if (!state) {
        await interaction.reply({ content: "No active search. Use /search to start one.", ephemeral: true });
        return;
    }

    let newPage = state.page;
    let newSortField = state.sortField;
    let newSearchTerm = state.searchTerm;

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
        case 'search_last': {
            const songs = await getSearchResults(state.searchTerm);
            const sorted = sortSongs(songs, state.sortField);
            const { totalPages } = paginateSongs(sorted);
            newPage = totalPages;
            break;
        }
        case 'search_sort_id':
            newSortField = 'song_id';
            newPage = 1;
            break;
        case 'search_sort_name':
            newSortField = 'name';
            newPage = 1;
            break;
        case 'search_sort_duration':
            newSortField = 'duration';
            newPage = 1;
            break;
        case 'search_sort_plays':
            newSortField = 'num_plays';
            newPage = 1;
            break;
        case 'search_open_modal': {
            const modal = buildSearchModal();
            await interaction.showModal(modal);
            return;
        }
        default:
            return;
    }

    await renderSearch(interaction, newSearchTerm, newPage, newSortField);
}

export async function handleSearchModal(interaction: ModalSubmitInteraction) {
    const searchTerm = interaction.fields.getTextInputValue('search_input');
    await renderSearch(interaction, searchTerm || null, 1, 'song_id');
}
