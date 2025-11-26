
export const countPage = (length, rowsPerPage) => {
    let count = 0;
    count = Math.trunc(length / rowsPerPage)

    if (Number((length % rowsPerPage).toFixed(0)) > 0) {
        count++;
    }
    return count
}

export const countPageDatastream = (total, perPage, dataStreamIds) => {
  return Math.ceil(total / (perPage*dataStreamIds)) || 1;
};

export function splitArrayDynamicColumns(array, twoColThreshold = 4, threeColThreshold = 8) {
    const length = array?.length || 0;

    if (!Array.isArray(array) || length === 0) {
        return {
            columns: [[]],
            columnCount: 1,
        };
    }

    let columnCount = 1;
    if (length >= threeColThreshold) {
        columnCount = 3;
    } else if (length >= twoColThreshold) {
        columnCount = 2;
    }

    const columns= Array.from({ length: columnCount }, () => []);

    array.forEach((item, index) => {
        columns[index % columnCount].push(item);
    });

    return {
        columns,
        columnCount,
    };
}

