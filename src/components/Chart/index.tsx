// Hooks
import { useChart } from "@contexts/ChartContext";

// Types
import { ChartRef, Image } from "@entities";

// Components
import { ChartImage } from "@components/ChartImage";
import { useConfig } from "@contexts/ConfigContext";
import { Key, useRef } from "react";
import {
  mergeProps,
  useFocusRing,
  useTable,
  useTableCell,
  useTableHeaderRow,
  useTableRow,
  useTableRowGroup,
  useTableColumnHeader,
} from "react-aria";
import {
  Cell,
  Column,
  Row,
  TableBody,
  TableHeader,
  useTableState,
} from "react-stately";

function sliceIntoChunkObjects<T>(arr: Array<T>, chunkSize: number) {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    let obj: { [x: string]: T } = {};

    for (let j = 0; j < chunk.length; j++) {
      obj[j] = chunk[j];
    }
    res.push(obj);
  }
  return res;
}

const TableHeaderRow = ({ item, state, children }: any) => {
  const ref = useRef<any>();
  const { rowProps } = useTableHeaderRow({ node: item }, state, ref);

  return (
    <tr {...rowProps} ref={ref}>
      {children}
    </tr>
  );
};

const TableColumnHeader = ({ column, state }: any) => {
  let ref = useRef<any>();
  let { columnHeaderProps } = useTableColumnHeader(
    { node: column },
    state,
    ref
  );
  let { isFocusVisible, focusProps } = useFocusRing();

  return (
    <th
      {...mergeProps(columnHeaderProps, focusProps)}
      colSpan={column.colspan}
      style={{
        textAlign: column.colspan > 1 ? "center" : "left",
        outline: isFocusVisible ? "2px solid orange" : "none",
        cursor: "default",
      }}
      ref={ref}
    >
      {column.rendered}
    </th>
  );
};

const TableCell = ({ cell, state, pad }: any) => {
  const ref = useRef<any>();
  const { gridCellProps } = useTableCell({ node: cell }, state, ref);
  const { isFocusVisible, focusProps } = useFocusRing();

  return (
    <td
      {...mergeProps(gridCellProps, focusProps)}
      className={`${isFocusVisible ? "outline outline-red-500" : ""}`}
      style={{ padding: `${pad}px` }}
      ref={ref}
    >
      {cell.rendered}
    </td>
  );
};

const TableRow = ({ item, children, state }: any) => {
  const ref = useRef<any>();
  const { rowProps } = useTableRow({ node: item }, state, ref);
  const { isFocusVisible, focusProps } = useFocusRing();

  return (
    <tr
      className={`${isFocusVisible ? "outline outline-blue-500" : ""}`}
      {...mergeProps(rowProps, focusProps)}
      ref={ref}
    >
      {children}
    </tr>
  );
};

const TableRowGroup = ({ type: Element, children }: any) => {
  const { rowGroupProps } = useTableRowGroup();

  return <Element {...rowGroupProps}>{children}</Element>;
};

const Table = (props: any) => {
  const state = useTableState(props);

  const ref = useRef<any>();
  const { collection } = state;
  const { gridProps } = useTable(props, state, ref);

  return (
    <table {...gridProps} ref={ref}>
      <TableRowGroup type="thead">
        {collection.headerRows.map((headerRow) => (
          <TableHeaderRow key={headerRow.key} item={headerRow} state={state}>
            {[...headerRow.childNodes].map((column) => (
              <TableColumnHeader
                key={column.key}
                column={column}
                state={state}
              />
            ))}
          </TableHeaderRow>
        ))}
      </TableRowGroup>
      <TableRowGroup type="tbody">
        {[...collection.body.childNodes].map((row) => (
          <TableRow key={row.key} item={row} state={state}>
            {[...row.childNodes].map((cell) => (
              <TableCell
                key={cell.key}
                cell={cell}
                state={state}
                pad={props.pad}
              />
            ))}
          </TableRow>
        ))}
      </TableRowGroup>
    </table>
  );
};

interface CollageProps {
  images: Image[];
  rows: number;
  cols: number;
  pad: number;
  showTitlesBelow: boolean;
  chartRef: ChartRef;
}

const Collage: React.FC<CollageProps> = ({
  images,
  rows,
  cols,
  pad,
  showTitlesBelow,
  chartRef,
}) => {
  images = [...images.slice(0, cols * rows)].map((img, i) => ({
    ...img,
    id: i,
  }));

  let tableCols = [];
  for (let i = 0; i < cols; i++) {
    tableCols.push({ name: i, key: i });
  }
  const items: Record<Key, number | Image>[] = sliceIntoChunkObjects(
    images,
    rows
  ).map((item, i) => ({
    ...item,
    id: i,
  }));

  return (
    <Table aria-label="Your chart" pad={pad}>
      <TableHeader columns={tableCols}>
        {(column) => <Column>&nbsp;</Column>}
      </TableHeader>
      <TableBody items={items}>
        {(item) => (
          <Row>
            {(columKey) => (
              <Cell>
                <ChartImage
                  pos={columKey as number}
                  showTitle={showTitlesBelow}
                  img={item[columKey] as Image}
                />
              </Cell>
            )}
          </Row>
        )}
      </TableBody>
    </Table>
  );

  // return (
  //   <ul
  //     className={`transition-all grid grid-rows-${rows} grid-cols-${cols} gap-${pad} p-${pad} w-max bg-white`}
  //     ref={chartRef}
  //   >
  //     {images.map((img, i) => (
  //       <li key={`${i} - ${img.url}`}>
  //         <ChartImage pos={i} img={img} showTitle={showTitlesBelow} />
  //       </li>
  //     ))}
  //   </ul>
  // );
};

interface Props {
  chartRef: ChartRef;
}

export const Chart: React.FC<Props> = ({ chartRef }) => {
  const {
    chart: { images },
  } = useChart();
  const {
    config: { rows, cols, pad, showTitlesBelow },
  } = useConfig();

  return (
    <div className="p-4 overflow-x-auto overflow-y-auto bg-white">
      <Collage
        images={images}
        rows={rows}
        cols={cols}
        pad={pad}
        showTitlesBelow={showTitlesBelow}
        chartRef={chartRef}
      />
    </div>
  );
};
