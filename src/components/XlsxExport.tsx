import { useState } from "react";
import { writeFileXLSX, utils } from "xlsx";
import { DB } from "../DB";
import { parse } from "../parser";

async function exportXLSX(db: DB) {
    const wb = utils.book_new();
    const data = await db.exportAll();
    data.map(entry => ({
        name: entry.filename,
        data: parse(entry.text)
    })).forEach(entry => {
        const columns = new Set<string>();
        const foo = (v: {}) => {
            Object.keys(v).forEach(c => columns.add(c));
            return v;
        }
        utils.book_append_sheet(wb, utils.json_to_sheet(
            entry.data.map(day => ({
                day: day.day,
                total: day.total,
                ...foo(day.entries)
            })), { header: ['day', 'total', ...columns] }
        ), entry.name);
    })
    writeFileXLSX(wb, "lulu.xlsx");
}

export function XlsxExport(props: { db: DB }) {
    const [working, setWorking] = useState(false);
    return <button
        disabled={working}
        style={{ float: 'right' }}
        onClick={async () => {
            setWorking(true);
            try {
                await exportXLSX(props.db);
            } finally {
                setWorking(false);
            }
        }}>
        {working ? '...' : 'XLSX'}
    </button>;
};