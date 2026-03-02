\"use client\";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Row = {
  id: number;
};

export default function SupabaseTest() {
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("your_table_name")
        .select("*")
        .limit(5);

      if (error) {
        setError(error.message);
      } else {
        setRows(data ?? []);
      }
    }

    load();
  }, []);

  if (error) {
    return <div className="p-4 text-red-600">Supabase error: {error}</div>;
  }

  return (
    <div className="p-4 border rounded-lg mt-4">
      <h2 className="font-semibold mb-2">Supabase Test (first 5 rows)</h2>
      <pre className="text-sm bg-muted p-2 rounded overflow-auto">
        {JSON.stringify(rows, null, 2)}
      </pre>
    </div>
  );
}

