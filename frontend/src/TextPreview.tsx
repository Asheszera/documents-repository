import React, { useEffect, useState } from "react";

const TextPreview: React.FC<{ filePath: string }> = ({ filePath }) => {
  const [text, setText] = useState("");

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`http://localhost:3001/files/${filePath}`);
      const content = await res.text();
      setText(content.length > 300 ? content.slice(0, 300) + "..." : content);
    };
    load();
  }, [filePath]);

  return <div>{text}</div>;
};

export default TextPreview;
