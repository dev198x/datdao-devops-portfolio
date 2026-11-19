import React from 'react';
import { Database } from 'lucide-react';
import CodeBlock from '../blog/CodeBlock';
import type { DatabaseSection, DbTable, FlowStore, StoreKind } from '../../data/chatbot-database';

const STORE_LABELS: Record<StoreKind, string> = {
  postgres: 'Postgres',
  redis: 'Redis',
  memory: 'Bộ nhớ',
  observability: 'Loki / Tempo',
};

// Colour tells the store, the arrow tells the direction.
const STORE_STYLES: Record<StoreKind, string> = {
  postgres: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
  redis: 'bg-orange-500/10 text-orange-600 border-orange-500/30',
  memory: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/30',
  observability: 'bg-purple-500/10 text-purple-600 border-purple-500/30',
};

const StoreChip: React.FC<{ store: FlowStore }> = ({ store }) => (
  <span
    className={`inline-flex items-center gap-1.5 px-2 py-1 rounded border font-mono text-xs ${STORE_STYLES[store.kind]}`}
    title={`${STORE_LABELS[store.kind]}: ${store.access === 'write' ? 'ghi' : 'đọc'}`}
  >
    <span className="font-semibold">{store.access === 'write' ? 'ghi →' : '← đọc'}</span>
    <span className="opacity-70">{STORE_LABELS[store.kind]}</span>
    <span>{store.label}</span>
  </span>
);

const SubTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="font-mono text-primary-500 text-lg font-semibold mb-3">{children}</h3>
);

const TableCard: React.FC<{ table: DbTable }> = ({ table }) => (
  <div className="bg-bg-surface border border-neutral-700 rounded-xl p-5 space-y-3">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h4 className="font-mono font-semibold text-neutral-200 flex items-center gap-2">
        <Database size={16} className="text-primary-500" />
        {table.name}
      </h4>
      <span className="text-xs font-mono text-neutral-500">{table.group}</span>
    </div>
    <p className="text-neutral-400 text-sm leading-relaxed">{table.purpose}</p>
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs font-mono text-neutral-500 border-b border-neutral-700">
            <th className="py-2 pr-3 font-medium">Cột</th>
            <th className="py-2 pr-3 font-medium">Kiểu</th>
            <th className="py-2 font-medium">Ý nghĩa</th>
          </tr>
        </thead>
        <tbody>
          {table.columns.map((column) => (
            <tr key={column.name} className="border-b border-neutral-700/50 last:border-0 align-top">
              <td className="py-2 pr-3 font-mono text-xs text-primary-500 whitespace-nowrap">{column.name}</td>
              <td className="py-2 pr-3 font-mono text-xs text-neutral-400 whitespace-nowrap">{column.type}</td>
              <td className="py-2 text-neutral-400 leading-relaxed">{column.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    {table.notes && (
      <ul className="space-y-1.5">
        {table.notes.map((note) => (
          <li key={note} className="flex items-start space-x-2 text-neutral-400 text-sm leading-relaxed">
            <span className="font-mono text-primary-500">&gt;</span>
            <span>{note}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
);

const DatabaseSchemaSection: React.FC<{ data: DatabaseSection }> = ({ data }) => {
  const groups = Array.from(new Set(data.tables.map((table) => table.group)));

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <p className="inline-block px-3 py-1 rounded-full border border-neutral-700 bg-bg-surface font-mono text-xs text-neutral-300">
          {data.engine}
        </p>
        <p className="text-neutral-200 leading-relaxed">{data.summary}</p>
        <ul className="space-y-2">
          {data.principles.map((principle) => (
            <li key={principle} className="flex items-start space-x-3 text-neutral-300 text-sm leading-relaxed">
              <span className="font-mono text-primary-500 mt-0.5">&gt;</span>
              <span>{principle}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <SubTitle>1. Quan hệ giữa các bảng</SubTitle>
        <CodeBlock code={data.relations} title="Sơ đồ quan hệ" />
        <ul className="space-y-1.5">
          {data.relationNotes.map((note) => (
            <li key={note} className="flex items-start space-x-2 text-neutral-400 text-sm leading-relaxed">
              <span className="font-mono text-primary-500">&gt;</span>
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-6">
        <SubTitle>2. Các bảng và cột chính</SubTitle>
        {groups.map((group) => (
          <div key={group} className="space-y-4">
            <h4 className="font-mono text-sm text-neutral-500">// {group}</h4>
            {data.tables
              .filter((table) => table.group === group)
              .map((table) => (
                <TableCard key={table.name} table={table} />
              ))}
          </div>
        ))}
      </div>

      <div>
        <SubTitle>3. Dữ liệu đi từ đầu đến cuối trong một lượt chat</SubTitle>
        <p className="text-neutral-400 text-sm leading-relaxed mb-4">
          Một lượt <span className="font-mono text-primary-500">POST /chat</span> đi qua các bước dưới đây. Mỗi bước cho biết dữ liệu được đọc từ đâu và ghi vào đâu:
          <span className="font-mono"> ghi →</span> là ghi, <span className="font-mono">← đọc</span> là đọc.
        </p>
        <ol className="space-y-3">
          {data.flow.map((step) => (
            <li key={step.step} className="bg-bg-surface border border-neutral-700 rounded-xl p-4 space-y-2">
              <div className="font-semibold text-neutral-200">{step.step}</div>
              <p className="text-neutral-400 text-sm leading-relaxed">{step.action}</p>
              <div className="flex flex-wrap gap-2 pt-1">
                {step.stores.map((store) => (
                  <StoreChip key={`${store.access}-${store.label}`} store={store} />
                ))}
              </div>
            </li>
          ))}
        </ol>

        <h4 className="font-mono text-sm text-neutral-500 mt-8 mb-3">// Kết quả để lại trong Postgres theo từng tình huống</h4>
        <div className="overflow-x-auto bg-bg-surface border border-neutral-700 rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-mono text-neutral-500 border-b border-neutral-700">
                <th className="p-3 font-medium">Tình huống</th>
                <th className="p-3 font-medium">conversations</th>
                <th className="p-3 font-medium">messages</th>
                <th className="p-3 font-medium">llm_calls</th>
                <th className="p-3 font-medium">orders</th>
              </tr>
            </thead>
            <tbody>
              {data.scenarios.map((row) => (
                <tr key={row.scenario} className="border-b border-neutral-700/50 last:border-0 align-top">
                  <td className="p-3 text-neutral-200 font-medium">{row.scenario}</td>
                  <td className="p-3 text-neutral-400">{row.conversations}</td>
                  <td className="p-3 text-neutral-400">{row.messages}</td>
                  <td className="p-3 text-neutral-400">{row.llmCalls}</td>
                  <td className="p-3 text-neutral-400">{row.orders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-neutral-500 text-xs mt-2">{data.scenariosNote}</p>
      </div>

      <div className="space-y-3">
        <SubTitle>4. DDL chính</SubTitle>
        {data.ddl.map((example) => (
          <CodeBlock key={example.caption} code={example.code} language={example.language} title={example.caption} />
        ))}
      </div>

      <div className="space-y-3">
        <SubTitle>5. Truy vấn thường dùng</SubTitle>
        {data.queries.map((example) => (
          <CodeBlock key={example.caption} code={example.code} language={example.language} title={example.caption} />
        ))}
      </div>

      <div>
        <SubTitle>6. Giới hạn hiện tại</SubTitle>
        <ul className="space-y-2">
          {data.limitations.map((item) => (
            <li key={item} className="flex items-start space-x-3 text-neutral-300 text-sm leading-relaxed">
              <span className="font-mono text-primary-500 mt-0.5">&gt;</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DatabaseSchemaSection;
