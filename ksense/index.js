document.addEventListener('DOMContentLoaded', (e) => {
  console.log('DOM fully loaded');
})

async function createListOfUserPosts({ postsRoot, url }) {
  emptyElementNode(postsRoot);

  if (postsRoot && url) {
    const response = await fetch(url);
    const postList = await response.json();

    postList.reduce(createAndRenderPostItem, postsRoot);
  }
}

async function createListOfUsers({ usersRoot, postsRoot }) {
  const usersRequestUrl = usersRoot.dataset.request;

  const userPostsRequestUrl = postsRoot.dataset.request;
  const userPostsPlaceholder = postsRoot.dataset.placeholder;

  const response = await fetch(usersRequestUrl);
  const userList = await response.json();

  if (userList.length >= 1) {
    const displayConfig = JSON.parse(
      usersRoot.dataset.display ?? '{}'
    );
    const headerContentList = Object.values(displayConfig);
    const rowContentKeyList = Object.keys(displayConfig);

    emptyElementNode(postsRoot);
    clearTableContent(usersRoot);

    usersRoot.appendChild(
      createTableHead(headerContentList)
    );
    usersRoot.appendChild(
      createTableBody(rowContentKeyList, userList)
    );
    usersRoot.addEventListener(
      'click',
      handleUserPostsRequestFromBoundData
        .bind({
          postsRoot,
          requestUrl: userPostsRequestUrl,
          placeholder: userPostsPlaceholder,
        })
    );
  }
}
