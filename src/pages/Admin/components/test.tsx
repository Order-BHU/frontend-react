import React from "react";
import { FixedSizeList as List } from "react-window";

// Define the data structure
interface ItemData {
  id: number;
  name: string;
  value: string;
}

// Props for individual row component
interface RowProps {
  index: number;
  style: React.CSSProperties;
  data: ItemData[];
}

// Individual row component
const Row: React.FC<RowProps> = ({ index, style, data }) => (
  <div style={style}>
    <div style={{ padding: "10px", border: "1px solid #ccc" }}>
      <strong>{data[index].name}</strong>
      <p>{data[index].value}</p>
    </div>
  </div>
);

// Main component
const VirtualizedList: React.FC = () => {
  // Generate sample data
  const items: ItemData[] = Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    name: `Item ${i + 1}`,
    value: `This is the content for item ${i + 1}`,
  }));

  return (
    <div>
      <h2>Virtualized List (1000 items)</h2>
      <List
        height={400} // Container height
        itemCount={items.length} // Total number of items
        itemSize={80} // Height of each item
        itemData={items} // Data to pass to each row
        width="100%" // Container width
      >
        {Row}
      </List>
    </div>
  );
};

export default VirtualizedList;
