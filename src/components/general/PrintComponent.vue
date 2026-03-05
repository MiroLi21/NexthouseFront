<script setup lang="ts">
import { computed } from "vue";
// Make sure this utility is available for formatting numbers
import { formatNumberClean } from "@/utilities/format";
import { t } from "@/utilities/I18nPlugin";
import { Icon } from "@iconify/vue";

type Align = "left" | "center" | "right";
export interface PrintHeader {
  caption: string;
  value: string; // slot name / data key
  width?: string; // e.g. "120px" | "20%"
  align?: Align; // default "left"
  print?: boolean; // if false => hidden in print
}

const props = withDefaults(
  defineProps<{
    pageTitle?: string;
    headers: PrintHeader[];
    rows: any[];
    zebra?: boolean;
    border?: boolean;
    orientation?: "portrait" | "landscape";
    pageBreakEvery?: number | null;
    headerHeight?: string | null;
    footerHeight?: string;
    footerOnLastPageOnly?: boolean;
  }>(),
  {
    pageTitle: "",
    zebra: true,
    border: true,
    orientation: "portrait",
    pageBreakEvery: null,
    footerHeight: "36mm",
    footerOnLastPageOnly: true,
    headerHeight: null,
  },
);

const printableHeaders = computed(() =>
  props.headers.filter((h) => h.print !== false),
);

const sheetStyles = computed(() => ({
  "--page-margin-bottom": props.footerOnLastPageOnly
    ? "12mm"
    : props.footerHeight,
}));

// Calculate totals from the 'pay' column, grouped by currency
const totalsByCurrency = computed(() => {
  return props.rows.reduce((acc: Record<string, number>, row: any) => {
    // Use a default currency symbol if none is provided
    const symbol = row.currencySymbol || "N/A";
    // Convert to number and handle different possible field names
    let pay = Number(row.debit) - Number(row.credit);
    // Ensure we're working with a valid number
    if (isNaN(pay)) pay = 0;

    // Initialize the accumulator for this currency if needed
    if (!acc[symbol]) {
      acc[symbol] = 0;
    }

    // Add the value to the accumulator
    acc[symbol] += pay;
    return acc;
  }, {});
});

function printNow() {
  requestAnimationFrame(() => window.print());
}
defineExpose({ printNow });
</script>

<template>
  <section
    class="print-sheet"
    :class="[
      props.orientation,
      { 'footer-on-last-page': props.footerOnLastPageOnly },
    ]"
    :style="sheetStyles"
  >
    <header class="sheet-header">
      <slot name="header">
        <div class="default-header">
          <div class="company-details">
            <h1 v-if="props.pageTitle != ''" class="sheet-title">
              {{ props.pageTitle }}
            </h1>
          </div>
          <div class="logo-placeholder">
            <Icon icon="mdi:cloud-outline" class="logo-icon" />
          </div>
        </div>
      </slot>
    </header>

    <main class="sheet-body">
      <table class="sheet-table" :class="{ 'with-border': props.border }">
        <thead>
          <tr>
            <th
              v-for="h in printableHeaders"
              :key="h.value"
              :style="{ width: h.width, textAlign: h.align || 'left' }"
            >
              {{ h.caption }}
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(row, ri) in props.rows" :key="ri">
            <tr :class="{ zebra: props.zebra && ri % 2 === 0 }">
              <td
                v-for="h in printableHeaders"
                :key="h.value"
                :style="{ textAlign: h.align || 'left' }"
              >
                <slot :name="h.value" :row="row" :index="ri">
                  {{ (row as any)[h.value] }}
                </slot>
              </td>
            </tr>
            <tr
              v-if="
                props.pageBreakEvery &&
                (ri + 1) % props.pageBreakEvery === 0 &&
                ri + 1 < props.rows.length
              "
              class="page-break-row"
            >
              <td :colspan="printableHeaders.length">
                <div class="page-break"></div>
              </td>
            </tr>
          </template>
        </tbody>

        <tfoot v-if="Object.keys(totalsByCurrency).length > 0">
          <tr>
            <td :colspan="printableHeaders.length" class="totals-spacer"></td>
          </tr>

          <tr
            v-for="(total, currency) in totalsByCurrency"
            :key="currency"
            class="totals-row"
          >
            <td :colspan="printableHeaders.length" class="totals-cell">
              <span>{{ t("Total") }} ({{ currency }}):</span>
              <span class="font-mono">{{ formatNumberClean(total) }}</span>
            </td>
          </tr>
        </tfoot>
      </table>
    </main>

    <footer class="sheet-footer-fixed">
      <div class="footer-inner">
        <slot name="footer"></slot>
        <div class="flex justify-center mt-3">
          <div class="footer-note">
            {{ t("Accounting System") }} (07711763932 - 07814455443)
          </div>
          <!-- <div class="page-info">
            <span class="print-date">{{ new Date().toLocaleString() }}</span>
            <span v-if="!props.footerOnLastPageOnly" class="page-number"></span>
          </div> -->
        </div>
      </div>
    </footer>
  </section>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap");

:root {
  --print-font-family: "Inter", sans-serif;
  --print-primary-color: #1d4ed8; /* A nice blue */
  --print-text-color: #374151; /* Dark gray */
  --print-border-color: #e5e7eb; /* Light gray */
  --print-header-bg: #f3f4f6;
}

/* Base Print Styles */
.print-sheet {
  display: none; /* Hidden by default, only visible for print */
  font-family: var(--print-font-family);
  color: var(--print-text-color);
}

@page {
  size: A4 portrait;
  margin: 15mm;
}

@media print {
  html,
  body {
    margin: 0 !important;
    padding: 0 !important;
    font-family: var(--print-font-family);
    -webkit-print-color-adjust: exact; /* Ensures backgrounds print */
  }
  body * {
    visibility: hidden;
  }
  .print-sheet,
  .print-sheet * {
    visibility: visible;
  }
  .print-sheet {
    position: absolute;
    inset: 0;
    margin: 0 !important;
    width: auto !important;
    counter-reset: page; /* Initialize page counter */
  }

  thead {
    display: table-header-group;
  }
  tfoot {
    display: table-footer-group; /* Default: repeats on every page */
  }
  tr,
  td,
  th {
    page-break-inside: avoid;
  }

  .page-break {
    page-break-after: always;
  }
  .page-break-row {
    display: block;
  }

  /* --- NEW STYLES FOR LAST PAGE FOOTER --- */
  /* When this class is active, change the footer's position from fixed to static */
  .footer-on-last-page .sheet-footer-fixed {
    position: static;
    height: auto; /* Let it take its natural height */
    margin-top: 10mm; /* Add some space above the final footer */
  }

  /* When this class is active, make the tfoot behave like a normal part of the table */
  .footer-on-last-page tfoot {
    display: table-row-group; /* This prevents it from repeating */
  }
  /* --- END NEW STYLES --- */
}

/* Header & Footer Layout */
.sheet-header {
  margin-bottom: 8mm;
  border-bottom: 2px solid var(--print-primary-color);
  padding-bottom: 4mm;
}
.default-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.sheet-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--print-primary-color);
  margin-bottom: 2mm;
}
.company-details p {
  font-size: 12px;
  line-height: 1.4;
  color: #6b7280;
}
.logo-placeholder {
  font-size: 48px;
  color: var(--print-primary-color);
}

.sheet-footer-fixed {
  position: fixed;
  left: 15mm;
  right: 15mm;
  bottom: 0;
  height: 15mm;
  display: flex;
  align-items: center;
}
.footer-inner {
  width: 100%;
  border-top: 1px solid var(--print-border-color);
  padding-top: 2mm;
}
.footer-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 10px;
  color: #6b7280;
}
.page-number::after {
  counter-increment: page;
  content: "Page " counter(page);
}

/* Table Styles */
.sheet-table {
  width: 100%;
  border-collapse: collapse;
}
.sheet-table th {
  text-align: left;
  font-weight: 600;
  font-size: 12px;
  padding: 10px 8px;
  background-color: var(--print-header-bg);
  color: #111827;
  border-bottom: 2px solid var(--print-border-color);
}
.sheet-table.with-border th,
.sheet-table.with-border td {
  border: 1px solid var(--print-border-color);
}
.sheet-table td {
  padding: 9px 8px;
  font-size: 12px;
  border-bottom: 1px solid var(--print-border-color);
}
.sheet-table tr.zebra td {
  background-color: #fafafa;
}
.sheet-table tbody tr:last-child td {
  border-bottom: none;
}

/* Totals Row Styles */
.totals-spacer {
  padding: 4px !important;
  border: none !important;
}
.totals-row {
  background-color: var(--print-header-bg) !important;
  font-weight: bold;
}
.totals-row:last-child {
  border-top: 2px solid #9ca3af;
}
.totals-cell {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  padding: 10px 8px !important;
}
.font-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
}
</style>
