async function fetchMediaFromNASA(searchQuery) {
    try {
      const apiUrl = `https://images-api.nasa.gov/search?q=${encodeURIComponent(searchQuery)}`;
      
      const response = await fetch(apiUrl);
      const data = await response.json(); 
  
      const imagesContainer = document.getElementById("images-container");
      imagesContainer.innerHTML = ""; 
  
      if (!isValidData(data)) {
        console.error("Nenhum resultado encontrado para a busca.");
        return;
      }
  
      for (const item of data.collection.items) {
        const mediaType = item.data[0].media_type;
        
        const mediaData = await fetch(item.href).then(response => response.json());
        
        const mediaUrl = getMediaUrl(mediaData, mediaType);
        const description = item.data[0].description;
        const title = item.data[0].title;
  
        const albumContainer = createAlbumContainer(mediaType, mediaUrl, description, title);
        imagesContainer.appendChild(albumContainer);
      }
    } catch (error) {
      console.error("Erro ao buscar dados na API:", error);
    }
  }

  function isValidData(data) {
    return data && data.collection && data.collection.items && data.collection.items.length > 0;
  }

  function getMediaUrl(mediaData, mediaType) {
    if (mediaType === "image") {
      return findImageMediaUrl(mediaData); 
    } else if (mediaType === "video") {
      return findVideoMediaUrl(mediaData); 
    }
  }
  
  function findImageMediaUrl(mediaData) {
    for (const mediaUrl of mediaData) {
      if (mediaUrl.endsWith(".jpg") || mediaUrl.endsWith(".png")) {
        return mediaUrl;
      }
    }
  }
  
  function findVideoMediaUrl(mediaData) {
    for (const mediaUrl of mediaData) {
      if (mediaUrl.endsWith(".mp4")) {
        return mediaUrl;
      }
    }
  }
  
  function createAlbumContainer(mediaType, mediaUrl, description, title) {
    const albumContainer = document.createElement("div");
    albumContainer.classList.add("album");
  
    if (mediaType === "image") {
      const imageElement = createImageElement(mediaUrl, description);
      albumContainer.appendChild(imageElement);
    } else if (mediaType === "video") {
      const videoElement = createVideoElement(mediaUrl);
      albumContainer.appendChild(videoElement);
    }
  
    const titleElement = document.createElement("h2");
    titleElement.textContent = title;
    albumContainer.appendChild(titleElement);
  
    return albumContainer;
  }
  
  function createImageElement(mediaUrl, description) {
    const imageElement = document.createElement("img");
    imageElement.src = mediaUrl;
    imageElement.alt = description;
    imageElement.addEventListener("click", () => openModal(mediaUrl, description));
    return imageElement;
  }
  
  function createVideoElement(mediaUrl) {
    const videoElement = document.createElement("video");
    videoElement.controls = true;
    const sourceElement = document.createElement("source");
    sourceElement.src = mediaUrl;
    sourceElement.type = "video/mp4";
    videoElement.appendChild(sourceElement);
    return videoElement;
  }
  
  function handleSearch() {
    const searchInput = document.getElementById("search-input");
    const searchQuery = searchInput.value.trim();
  
    if (searchQuery !== "") {
      fetchMediaFromNASA(searchQuery);
    }
  }
  
  document.getElementById("search-button").addEventListener("click", handleSearch);
  
  function openModal(mediaUrl, description) {
    const modalContainer = document.getElementById("modal-container");
    const modalImage = document.getElementById("modal-image");
    const modalDescription = document.getElementById("modal-description");
  
    modalImage.src = mediaUrl;
    modalDescription.textContent = description; 
    modalContainer.style.display = "flex";
  }
  
  function closeModal() {
    const modalContainer = document.getElementById("modal-container");
    modalContainer.style.display = "none";
  }
