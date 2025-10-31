import { useState } from "react";

type Props = {
  search: string;
  onSearch: (value: string) => void;
};

export default function AssessmentFilter({ search, onSearch }: Props) {
  const [input, setInput] = useState(search);

  return (
    <div className="mb-6 flex items-center gap-4">
      <input
        className="border rounded px-4 py-2 w-full max-w-md"
        placeholder="Search assessments by title or job…"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          onSearch(e.target.value);
        }}
        type="search"
      />
    </div>
  );
}
