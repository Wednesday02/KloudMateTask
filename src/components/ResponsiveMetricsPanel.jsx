import React, { useState, useEffect, useMemo } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { Resizable } from "re-resizable";

const ResponsiveGridLayout = WidthProvider(Responsive);

const ResponsiveMetricsGrid = ({
  data = [
    { label: "Temperature", value: 73 },
    { label: "Humidity", value: 65 },
    { label: "Wind Speed", value: 15 },
    { label: "UV", value: 3 },
    { label: "Air Quality Index", value: 42 },
    { label: "Precipitation", value: 30 },
    { label: "Cloud Cover", value: 75 },
    { label: "Visibility", value: 8 },
    { label: "Pressure", value: 1013 },
  ],
  initialWidth = 800,
  initialHeight = 600,
}) => {
  const [gridSize, setGridSize] = useState({
    width: initialWidth,
    height: initialHeight,
  });
  // const [viewportDimensions, setViewportDimensions] = useState({
  //   width: typeof window !== "undefined" ? window.innerWidth : 1200,
  //   height: typeof window !== "undefined" ? window.innerHeight : 800,
  // });

  // state to track desired number of rows
  const [desiredRows, setDesiredRows] = useState(1);

  // window resize and initial sizing
  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateDimensions = () => {
      // setViewportDimensions({
      //   width: window.innerWidth,
      //   height: window.innerHeight,
      // });
    };

    window.addEventListener("resize", updateDimensions);
    updateDimensions();

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // layout calculation based on container height
  useEffect(() => {
    // number of rows based on container height
    const baseHeight = 180; // Base height for one row
    const heightRatio = gridSize.height / baseHeight;

    // default to vertical layout
    if (gridSize.width < 240) {
      setDesiredRows(data.length); 
    }
    // default to horizontal layout
    else if (gridSize.height < 120) {
      setDesiredRows(1); // All items in one row
    }
    else {
      // Map height to rows
      let rows = Math.max(1, Math.min(3, Math.round(heightRatio)));

      const heightPerRow = gridSize.height / rows;
      if (heightPerRow < 100 && rows > 1) {
        rows = Math.max(1, rows - 1);
      }

      setDesiredRows(rows);
    }
  }, [gridSize.width, gridSize.height, data.length]);

  // layout generation with progressive row formation
  const { layout, numColumns, numRows } = useMemo(() => {
    const itemCount = data.length;
    const availableWidth = gridSize.width;

    // columns based on desired rows
    const columns = Math.ceil(itemCount / desiredRows);

    const minColumnWidth = 120;
    const maxPossibleColumns = Math.max(
      1,
      Math.floor(availableWidth / minColumnWidth)
    );

    // Adjust columns if needed
    const finalColumns = Math.min(columns, maxPossibleColumns);

    // Recalculate rows based on the adjusted columns
    const finalRows = Math.ceil(itemCount / finalColumns);

    // Create layout grid
    const generatedLayout = data.map((_, index) => ({
      i: `item-${index}`,
      x: index % finalColumns,
      y: Math.floor(index / finalColumns),
      w: 1,
      h: 1,
    }));

    return {
      layout: generatedLayout,
      numColumns: finalColumns,
      numRows: finalRows,
    };
  }, [gridSize, desiredRows, data]);

  // Calculate the maximum text lengths for consistent sizing
  const maxValueLength = useMemo(
    () =>
      Math.max(
        ...data.map((item) => (item.value?.toString() || "").length || 1)
      ),
    [data]
  );

  const maxLabelLength = useMemo(
    () => Math.max(...data.map((item) => (item.label || "").length || 1)),
    [data]
  );

  // Improved grid font size calculation with better scaling
  const calculateGridFontSize = (cellWidth, cellHeight, isLabel = false) => {
    // Use max lengths for consistent sizing across all cells
    const textLength = isLabel ? maxLabelLength : maxValueLength;

    // More conservative factors for better spacing
    const widthFactor = isLabel ? 2.2 : 1.8;
    const heightFactor = isLabel ? 0.25 : 0.45;

    // Calculate size based on container dimensions
    const widthBasedSize = cellWidth / (textLength * widthFactor);
    const heightBasedSize = cellHeight * heightFactor;

    // More restrictive size constraints
    const minSize = 8; // Increased minimum size
    const maxSize = isLabel ? 18 : 28; // Reduced maximum sizes

    return Math.max(
      minSize,
      Math.min(widthBasedSize, heightBasedSize, maxSize)
    );
  };

  const renderGridItem = (item, index) => {
    if (!item) return null;

    // Calculate cell dimensions with margins to prevent overlap
    const cellWidth = (gridSize.width / numColumns) * 0.95; // Add 5% margin
    const cellHeight = (gridSize.height / numRows) * 0.9; // Add 10% margin

    // Calculate font sizes with conservative values
    const valueFontSize = calculateGridFontSize(
      cellWidth * 0.9,
      cellHeight * 0.5
    );
    const labelFontSize = calculateGridFontSize(
      cellWidth * 0.9,
      cellHeight * 0.25,
      true
    );

    // Dynamic padding based on cell size
    const padding = Math.max(
      4,
      Math.min(8, Math.min(cellWidth, cellHeight) * 0.03)
    );

    return (
      <div
        key={`item-${index}`}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#2a2a2a",
          borderRadius: `${Math.min(
            6,
            Math.min(cellWidth, cellHeight) * 0.05
          )}px`,
          color: "#fff",
          padding: `${padding}px`,
          textAlign: "center",
          height: "98%",
          width: "98%",
          overflow: "hidden",
          boxSizing: "border-box",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          margin: "auto", // Center in cell
        }}
      >
        <div
          style={{
            fontSize: `${valueFontSize}px`,
            fontWeight: "bold",
            lineHeight: "1.1",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "95%",
            textAlign: "center",
            padding: "2px 0",
          }}
        >
          {item.value}
        </div>
        <div
          style={{
            fontSize: `${labelFontSize}px`,
            opacity: 0.8,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "90%",
            marginTop: `${Math.max(2, cellHeight * 0.02)}px`,
            textAlign: "center",
            padding: "2px 0",
          }}
        >
          {item.label}
        </div>
      </div>
    );
  };


  // Increase margins to create more space between cells
  const layoutSettings = {
    margin: [2, 2],
    containerPadding: [5, 5],
  };

  return (
    <Resizable
      size={gridSize}
      minWidth={200}
      minHeight={150}
      onResize={(e, direction, ref) => {
        setGridSize({
          width: ref.offsetWidth,
          height: ref.offsetHeight,
        });
      }}
      style={{
        background: "#111",
        border: "1px solid #444",
        borderRadius: "4px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "8px",
          left: "8px",
          color: "#fff",
          fontSize: "12px",
          opacity: 0.8,
          zIndex: 10, // Increased z-index
          backgroundColor: "rgba(17, 17, 17, 0.7)", // Semi-transparent background
          padding: "2px 4px",
          borderRadius: "2px",
          maxWidth: "40%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        Multi Series
      </div>

      <ResponsiveGridLayout
        layouts={{ lg: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{
          lg: numColumns,
          md: numColumns,
          sm: numColumns,
          xs: numColumns,
          xxs: numColumns,
        }}
        rowHeight={gridSize.height / numRows - layoutSettings.margin[1]}
        width={gridSize.width}
        margin={layoutSettings.margin}
        containerPadding={layoutSettings.containerPadding}
        isDraggable={false}
        isResizable={false}
        compactType="vertical"
        useCSSTransforms={false}
        preventCollision={false}
        autoSize={true}
        // Add more space at the top to avoid overlap with the header
        style={{ paddingTop: "24px" }}
      >
        {data.map((item, index) => (
          <div key={`item-${index}`}>{renderGridItem(item, index)}</div>
        ))}
      </ResponsiveGridLayout>
    </Resizable>
  );
};

export default ResponsiveMetricsGrid;