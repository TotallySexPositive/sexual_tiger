import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    LabelBuilder,
    TextInputBuilder,
    TextInputStyle,
} from 'discord.js';
import type {
    ChatInputCommandInteraction,
    ButtonInteraction,
    ModalSubmitInteraction,
    MessageActionRowComponentBuilder,
} from 'discord.js';
import asciitable from 'asciitable';

export type SortDirection = 'ASC' | 'DESC';

export interface SortButtonConfig<TField extends string> {
    customId: string;
    field: TField;
    label: string;
}

export interface TableState<TField extends string> {
    searchTerm: string | null;
    page: number;
    totalPages: number;
    sortField: TField;
    sortDirection: SortDirection;
}

export type PaginatedInteraction = ChatInputCommandInteraction | ButtonInteraction | ModalSubmitInteraction;

export const DEFAULT_PAGE_SIZE = 20;
export const DISCORD_MAX_CHARS = 2000;
export const NAME_MAX_LEN = 45;

export function truncateText(text: string, maxLen: number = NAME_MAX_LEN): string {
    if (text.length > maxLen) {
        return text.substring(0, maxLen - 3) + "...";
    }
    return text;
}

export function buildTableContent<TItem>(
    items: TItem[],
    page: number,
    tableOptions: any,
    mapRow: (item: TItem) => Record<string, any>,
    pageSize: number = DEFAULT_PAGE_SIZE
): { content: string; page: number; totalPages: number; displayedItems: TItem[] } {
    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
    const clampedPage = Math.min(Math.max(1, page), totalPages);
    const startIdx = (clampedPage - 1) * pageSize;
    const displayedItems = items.slice(startIdx, startIdx + pageSize);
    const pageRows = displayedItems.map(mapRow);

    let table = asciitable(tableOptions, pageRows);
    while (table.length + 6 > DISCORD_MAX_CHARS && pageRows.length > 1) {
        pageRows.pop();
        displayedItems.pop();
        table = asciitable(tableOptions, pageRows);
    }

    return {
        content: "```" + table + "```",
        page: clampedPage,
        totalPages,
        displayedItems,
    };
}

export function buildPaginationRow(prefix: string, page: number, totalPages: number): ActionRowBuilder<ButtonBuilder> {
    const firstBtn = new ButtonBuilder()
        .setCustomId(`${prefix}_first`)
        .setLabel('<<')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(page <= 1);

    const prevBtn = new ButtonBuilder()
        .setCustomId(`${prefix}_prev`)
        .setLabel('<')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(page <= 1);

    const pageInfoBtn = new ButtonBuilder()
        .setCustomId(`${prefix}_pageinfo`)
        .setLabel(`${page}/${totalPages}`)
        .setStyle(ButtonStyle.Primary);

    const nextBtn = new ButtonBuilder()
        .setCustomId(`${prefix}_next`)
        .setLabel('>')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(page >= totalPages);

    const lastBtn = new ButtonBuilder()
        .setCustomId(`${prefix}_last`)
        .setLabel('>>')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(page >= totalPages);

    return new ActionRowBuilder<ButtonBuilder>().addComponents(firstBtn, prevBtn, pageInfoBtn, nextBtn, lastBtn);
}

export function buildSortRow<TField extends string>(
    sortButtonsConfig: SortButtonConfig<TField>[],
    openModalCustomId: string,
    sortField: TField,
    sortDirection: SortDirection
): ActionRowBuilder<ButtonBuilder> {
    const dirIcon = sortDirection === 'ASC' ? '▲' : '▼';

    const sortButtons = sortButtonsConfig.map(({ customId, field, label }) => {
        const isActive = sortField === field;
        return new ButtonBuilder()
            .setCustomId(customId)
            .setLabel(isActive ? `${label} ${dirIcon}` : label)
            .setStyle(isActive ? ButtonStyle.Success : ButtonStyle.Secondary);
    });

    const searchBtn = new ButtonBuilder()
        .setCustomId(openModalCustomId)
        .setLabel('Search')
        .setStyle(ButtonStyle.Primary);

    return new ActionRowBuilder<ButtonBuilder>().addComponents(...sortButtons, searchBtn);
}

export function buildSearchModal(
    customId: string,
    title: string,
    inputCustomId: string,
    labelText: string,
    placeholder: string
): ModalBuilder {
    const input = new TextInputBuilder()
        .setCustomId(inputCustomId)
        .setPlaceholder(placeholder)
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

    const label = new LabelBuilder()
        .setLabel(labelText)
        .setTextInputComponent(input);

    return new ModalBuilder()
        .setCustomId(customId)
        .setTitle(title)
        .addLabelComponents(label);
}

export function buildPageJumpModal(
    customId: string,
    inputCustomId: string,
    currentPage: number,
    totalPages: number
): ModalBuilder {
    const input = new TextInputBuilder()
        .setCustomId(inputCustomId)
        .setPlaceholder(`1 - ${totalPages}`)
        .setValue(String(currentPage))
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const label = new LabelBuilder()
        .setLabel(`Page Number (1-${totalPages})`)
        .setTextInputComponent(input);

    return new ModalBuilder()
        .setCustomId(customId)
        .setTitle('Jump to Page')
        .addLabelComponents(label);
}

export function getFallbackKey(interaction: PaginatedInteraction): string {
    return `${interaction.guildId}:${interaction.user.id}`;
}

export function getState<TField extends string>(
    store: Map<string, TableState<TField>>,
    interaction: ButtonInteraction | ModalSubmitInteraction
): TableState<TField> | undefined {
    if (interaction.message?.id && store.has(interaction.message.id)) {
        return store.get(interaction.message.id);
    }
    return store.get(getFallbackKey(interaction));
}

export async function sendOrUpdatePaginatedMessage<TField extends string>(
    interaction: PaginatedInteraction,
    store: Map<string, TableState<TField>>,
    state: TableState<TField>,
    content: string,
    components: ActionRowBuilder<MessageActionRowComponentBuilder>[]
): Promise<void> {
    if (interaction.isButton() || (interaction.isModalSubmit() && interaction.isFromMessage())) {
        await interaction.update({ content, components });
        store.set(interaction.message.id, state);
        return;
    }

    const response = await interaction.reply({
        content,
        components,
        ephemeral: true,
        withResponse: true,
    });
    const stateKey = response.resource?.message?.id || getFallbackKey(interaction);
    store.set(stateKey, state);
}
