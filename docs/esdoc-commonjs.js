module.exports.onHandleCode = (ev) => {
  ev.data.code = ev.data.code // eslint-disable-line
    .replace(/module\s*\.\s*exports\s*=\s?/g,
      'export default ')

    .replace(/module.exports\s*\.\s*([_\d\w]+)\s*=\s*(class|function\*?)\s+\1/g,
      'export $2 $1')

    .replace(/exports\s*\.\s*([_\d\w]+)\s*=\s*(class|function\*?)\s+\1/g,
      'export $2 $1')

    .replace(/module.exports\s*\.\s*([_\d\w]+)\s*=\s*\1\s*;/g,
      'export { $1 };')

    .replace(/exports\s*\.\s*([_\d\w]+)\s*=\s*\1\s*;/g,
      'export { $1 };')

    .replace(/module.exports\s*\.\s*([_\d\w]+)\s*=/g,
      'export let $1 =')

    .replace(/exports\s*\.\s*([_\d\w]+)\s*=/g,
      'export let $1 =')

    .replace(/^(?:const|var|let)\s(\w+)\s*=\s*require\s*\(\s*(.*?)\s*\)/gm,
      'import $1 from $2')

    .replace(/^(?:const|var|let)\s*(\{(?:[\s\S]*?)\})\s*=\s*require\s*\(\s*(.*?)\s*\)/gm, // eslint-disable-line
      'import $1 from $2')

    .replace(/^require\s*\(\s*(.*?)\s*\)/gm,
      'import $1');
};
