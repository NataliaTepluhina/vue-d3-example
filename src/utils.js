export const transformData = arr => ({
  name: 'Top Level',
  children: arr.map(repo => ({
    ...repo,
    parent: 'Top Level',
  })),
});

const colors = ['#ff7665', '#ffb469', '#ffe876', '#fff', '#99cdff'];
