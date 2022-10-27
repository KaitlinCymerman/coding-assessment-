document.addEventListener('DOMContentLoaded', (e) => {
  console.log('DOM fully loaded');
})

function emptyElementNode(node) {
  [...node.childNodes].forEach(child => child.remove());
}
function clearTableContent(root) {
  [
    ...root.querySelectorAll('thead'), 
    ...root.querySelectorAll('tbody'),

  ].forEach(child => child.remove());
}

function createTableHead(headerContentList) {
  const elmThead = document.createElement('thead');
  const elmTr = headerContentList
    .reduce((root, content) => {

      const elmTh = document.createElement('th');
      elmTh.textContent = content;

      root.appendChild(elmTh);

      return root;      
    }, document.createElement('tr'));
  
  elmThead.appendChild(elmTr);
  return elmThead;
}
function createTableBody(rowContentKeyList, userList) {
  return userList
    .reduce((elmTbody, userItem) => {

      const elmTr = rowContentKeyList
        .reduce((root, key) => {

          const elmTd = document.createElement('td');
          elmTd.textContent = userItem[key];

          root.appendChild(elmTd);

          return root;
        }, document.createElement('tr'));

      elmTr.dataset.id = userItem.id;
      elmTbody.appendChild(elmTr);

      return elmTbody;
    }, document.createElement('tbody'));
}
function createAndRenderPostItem(root, { title, body }) {
  const elmDt = document.createElement('dt');
  const elmDd = document.createElement('dd');

  elmDt.textContent = title;
  elmDd.textContent = body;

  root.appendChild(elmDt);
  root.appendChild(elmDd);

  return root;
}

function updateSelectedStates(selectedRow) {
  [...selectedRow.parentNode.children]
    .forEach(rowNode =>
      rowNode.classList.remove('selected')
    );
  selectedRow.classList.add('selected');
}

function handleUserPostsRequestFromBoundData({ target }) {
  const { postsRoot, requestUrl, placeholder } = this;

  const currentRow = target.closest('tr');
  const userId = currentRow?.dataset?.id;

  if (userId) {
    createListOfUserPosts({
      postsRoot,
      url: requestUrl.replace(placeholder, userId)
    });
    updateSelectedStates(currentRow);
  }
}

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

function initializeUserPostsComponent(root) {
  const usersRoot = root.querySelector('[data-users]');
  const postsRoot = root.querySelector('[data-posts]');

  createListOfUsers({ usersRoot, postsRoot });
}
document
  .querySelectorAll('[data-user-posts]')
  .forEach(initializeUserPostsComponent);
