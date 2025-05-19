document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const videoUrlInput = document.getElementById('videoUrl');
    const convertBtn = document.getElementById('convertBtn');
    const resultContainer = document.getElementById('result');
    const loadingContainer = document.getElementById('loading');
    const downloadContainer = document.getElementById('download');
    const thumbnailImg = document.getElementById('thumbnail');
    const videoTitleEl = document.getElementById('videoTitle');
    const videoDurationEl = document.getElementById('videoDuration');
    const mp4Options = document.getElementById('mp4Options');
    const mp3Options = document.getElementById('mp3Options');
    const formatBtns = document.querySelectorAll('.format-btn');
    const downloadBtn = document.getElementById('downloadBtn');
    
    // Global variables
    let currentVideoId = '';
    let currentVideoInfo = null;
    let selectedFormat = 'mp4';
    let selectedQuality = '';
    let downloadUrl = '';
    
    // Event listeners
    convertBtn.addEventListener('click', handleConvert);
    
    // Format toggle
    formatBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const format = btn.dataset.format;
            
            // Update active button
            formatBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show corresponding options
            if (format === 'mp4') {
                mp4Options.classList.remove('hidden');
                mp3Options.classList.add('hidden');
            } else {
                mp3Options.classList.remove('hidden');
                mp4Options.classList.add('hidden');
            }
            
            selectedFormat = format;
        });
    });
    
    // Helper to extract video ID from YouTube URL
    function extractVideoId(url) {
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[7].length === 11) ? match[7] : null;
    }
    
    // Convert button handler
    function handleConvert() {
        const url = videoUrlInput.value.trim();
        
        if (!url) {
            alert('Please enter a valid YouTube URL');
            return;
        }
        
        currentVideoId = extractVideoId(url);
        
        if (!currentVideoId) {
            alert('Invalid YouTube URL. Please enter a valid YouTube video URL');
            return;
        }
        
        // Show loading
        resultContainer.classList.add('hidden');
        downloadContainer.classList.add('hidden');
        loadingContainer.classList.remove('hidden');
        
        // Fetch video info
        fetchVideoInfo(currentVideoId)
            .then(info => {
                // Hide loading
                loadingContainer.classList.add('hidden');
                
                if (info) {
                    // Store video info
                    currentVideoInfo = info;
                    
                    // Update UI with video details
                    updateVideoDetails(info);
                    
                    // Generate download options
                    generateDownloadOptions(info);
                    
                    // Show result container
                    resultContainer.classList.remove('hidden');
                } else {
                    alert('Could not fetch video information. Please try again.');
                }
            })
            .catch(error => {
                loadingContainer.classList.add('hidden');
                alert('An error occurred: ' + error.message);
            });
    }
    
    // Fetch video information from API
    async function fetchVideoInfo(videoId) {
        try {
            // In a real implementation, this would call your backend API
            // Here we're simulating the response for demonstration
            const response = await fetch(`/api/video-info?videoId=${videoId}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch video info');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching video info:', error);
            
            // For demo purposes, return mock data
            return getMockVideoInfo(videoId);
        }
    }
    
    // Generate mock video data for demonstration
    function getMockVideoInfo(videoId) {
        // This function simulates API response for demo purposes
        return {
            id: videoId,
            title: 'Sample YouTube Video',
            duration: '10:15',
            thumbnail: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
            formats: {
                mp4: [
                    { quality: '720p', label: 'HD (720p)', size: '45 MB' },
                    { quality: '480p', label: '480p', size: '28 MB' },
                    { quality: '360p', label: '360p', size: '18 MB' },
                    { quality: '240p', label: '240p', size: '12 MB' }
                ],
                mp3: [
                    { quality: '256kbps', label: 'High Quality (256 kbps)', size: '9.8 MB' },
                    { quality: '192kbps', label: 'Medium Quality (192 kbps)', size: '7.5 MB' },
                    { quality: '128kbps', label: 'Normal Quality (128 kbps)', size: '5.2 MB' }
                ]
            }
        };
    }
    
    // Update video details in UI
    function updateVideoDetails(info) {
        thumbnailImg.src = info.thumbnail;
        videoTitleEl.textContent = info.title;
        videoDurationEl.textContent = `Duration: ${info.duration}`;
    }
    
    // Generate download options based on available formats
    function generateDownloadOptions(info) {
        // Clear previous options
        mp4Options.innerHTML = '';
        mp3Options.innerHTML = '';
        
        // Generate MP4 options
        info.formats.mp4.forEach(format => {
            const option = createQualityOption(format, 'mp4');
            mp4Options.appendChild(option);
        });
        
        // Generate MP3 options
        info.formats.mp3.forEach(format => {
            const option = createQualityOption(format, 'mp3');
            mp3Options.appendChild(option);
        });
        
        // Add click event to quality options
        const qualityOptions = document.querySelectorAll('.quality-option');
        qualityOptions.forEach(option => {
            option.addEventListener('click', handleQualitySelect);
        });
    }
    
    // Create quality option element
    function createQualityOption(format, type) {
        const option = document.createElement('div');
        option.className = 'quality-option';
        option.dataset.quality = format.quality;
        option.dataset.type = type;
        
        option.innerHTML = `
            <div class="quality-info">${format.label}</div>
            <div class="quality-size">${format.size}</div>
        `;
        
        return option;
    }
    
    // Handle quality selection
    function handleQualitySelect(e) {
        const option = e.currentTarget;
        const quality = option.dataset.quality;
        const type = option.dataset.type;
        
        // Update selected option UI
        const allOptions = document.querySelectorAll('.quality-option');
        allOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        
        // Store selected format and quality
        selectedFormat = type;
        selectedQuality = quality;
        
        // In a real app, this would trigger server-side conversion
        // For demo, we'll simulate the process
        loadingContainer.classList.remove('hidden');
        resultContainer.classList.add('hidden');
        
        // Simulate conversion process
        setTimeout(() => {
            loadingContainer.classList.add('hidden');
            downloadContainer.classList.remove('hidden');
            
            // Set click handler for download button
            downloadBtn.onclick = () => {
                // In a real app, this would download the actual file
                // For demo, we'll just log to console
                console.log(`Downloading ${selectedFormat} file with quality ${selectedQuality}`);
                alert('Download started! This is a demo, so no actual file will be downloaded.');
            };
        }, 2000);
    }
});
