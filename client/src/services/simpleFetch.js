async function simpleFetch (url, options) {
    console.log("Fetching:", url, options);
    const response = await fetch(url, options);
    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }
    const data = await response.json();

    if (!data) {
        return null;
    }
    return data;
}

export default simpleFetch;

