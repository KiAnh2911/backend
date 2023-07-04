const addHttpPrefix = (url: string) => {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return (url = "http://" + url);
  }
  return url;
};

export default addHttpPrefix;
