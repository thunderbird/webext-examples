// Wrapper for handling errors during creation of menu items.
export async function addEntry(createData) {
  let { promise, resolve, reject } = Promise.withResolvers();
  let error;
  let id = browser.menus.create(createData, () => { 
    error = browser.runtime.lastError; // Either null or an Error object.
    if (error) {
      reject(error)
    } else {
      resolve();
    }
  });

  try {
    await promise;
    console.info(`Successfully created menu entry <${id}>`);
  } catch (error) {
    if (error.message.includes("already exists")) {
      console.info(`The menu entry <${id}> exists already and was not added again.`);
    } else {
      console.error("Failed to create menu entry:", createData, error);
    }
  }

  return id;
}

