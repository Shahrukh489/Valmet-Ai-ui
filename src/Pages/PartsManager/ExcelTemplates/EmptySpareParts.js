export const EmptySpareParts = async (url, fileName) => {
  try {
    const response = await fetch(url); // Fetch the file from the provided URL
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    // Get the blob from the response
    const blob = await response.blob();
    
    // Create a URL for the blob
    const blobUrl = window.URL.createObjectURL(blob);
    
    // Create a link element
    const link = document.createElement('a');
    link.href = blobUrl;
    link.setAttribute('download', fileName);
    
    // Append the link to the body
    document.body.appendChild(link);
    
    // Programmatically click the link to trigger the download
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl); // Free up memory
  } catch (error) {
    console.error('Error downloading the file:', error);
  }
};