# Marketing Video Integration Guide

This guide explains how to integrate your marketing video into the BizGrow website.

## 🎥 Video Integration Options

### Option 1: YouTube Integration (Recommended)

1. **Upload your video to YouTube**
2. **Get the video ID** from the URL (e.g., `dQw4w9WgXcQ` from `https://www.youtube.com/watch?v=dQw4w9WgXcQ`)
3. **Update the HTML** in `index.html`:

```html
<!-- Replace the video-placeholder div with this -->
<div class="video-container">
    <iframe 
        width="100%" 
        height="400" 
        src="https://www.youtube.com/embed/YOUR_VIDEO_ID?rel=0&showinfo=0&modestbranding=1" 
        frameborder="0" 
        allowfullscreen>
    </iframe>
</div>
```

### Option 2: Vimeo Integration

1. **Upload to Vimeo**
2. **Get the video ID**
3. **Update the HTML**:

```html
<div class="video-container">
    <iframe 
        src="https://player.vimeo.com/video/YOUR_VIDEO_ID?color=3b82f6&title=0&byline=0&portrait=0" 
        width="100%" 
        height="400" 
        frameborder="0" 
        allowfullscreen>
    </iframe>
</div>
```

### Option 3: Self-Hosted Video

1. **Add your video file** to `docs/assets/` directory
2. **Update the HTML**:

```html
<div class="video-container">
    <video 
        width="100%" 
        height="400" 
        controls 
        poster="./assets/video-thumbnail.jpg">
        <source src="./assets/bizgrow-demo.mp4" type="video/mp4">
        <source src="./assets/bizgrow-demo.webm" type="video/webm">
        Your browser does not support the video tag.
    </video>
</div>
```

### Option 4: Loom Integration

1. **Upload to Loom**
2. **Get the embed code**
3. **Update the HTML**:

```html
<div class="video-container">
    <div style="position: relative; padding-bottom: 56.25%; height: 0;">
        <iframe 
            src="https://www.loom.com/embed/YOUR_VIDEO_ID" 
            frameborder="0" 
            webkitallowfullscreen 
            mozallowfullscreen 
            allowfullscreen 
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
        </iframe>
    </div>
</div>
```

## 🎨 Styling Considerations

### Responsive Video Container

The current CSS includes responsive video styling:

```css
.video-container {
    position: relative;
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: var(--shadow-xl);
}

.video-container iframe,
.video-container video {
    width: 100%;
    height: auto;
    min-height: 300px;
}
```

### Video Thumbnail

For better loading performance, consider adding a custom thumbnail:

```html
<div class="video-container" onclick="loadVideo()">
    <div class="video-thumbnail">
        <img src="./assets/video-thumbnail.jpg" alt="BizGrow Demo Video">
        <div class="play-button">
            <i class="fas fa-play"></i>
        </div>
    </div>
</div>
```

## 📱 Mobile Optimization

### Lazy Loading

Add lazy loading for better performance:

```html
<iframe 
    src="about:blank" 
    data-src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
    loading="lazy"
    width="100%" 
    height="400">
</iframe>
```

### Touch-Friendly Controls

Ensure video controls are touch-friendly on mobile devices.

## 🚀 Performance Tips

1. **Use a thumbnail** and load video on click
2. **Compress your video** for faster loading
3. **Use multiple formats** (MP4, WebM) for browser compatibility
4. **Enable lazy loading** for videos below the fold
5. **Consider autoplay policies** (most browsers block autoplay with sound)

## 📊 Analytics Tracking

Track video engagement:

```javascript
// YouTube API example
function onYouTubeIframeAPIReady() {
    player = new YT.Player('video-player', {
        events: {
            'onStateChange': function(event) {
                if (event.data == YT.PlayerState.PLAYING) {
                    trackEvent('video_play', { video_id: 'YOUR_VIDEO_ID' });
                }
                if (event.data == YT.PlayerState.ENDED) {
                    trackEvent('video_complete', { video_id: 'YOUR_VIDEO_ID' });
                }
            }
        }
    });
}
```

## 🎯 Current Implementation

The website currently shows a placeholder that:
- Displays a play button icon
- Shows "Marketing Video Coming Soon"
- Links to the live demo when clicked
- Is styled to match the overall design

To replace it with your actual video, follow one of the integration options above.

## 🔧 Quick Setup Steps

1. Choose your video hosting platform
2. Upload your marketing video
3. Get the embed code or video ID
4. Replace the `.video-placeholder` div in `index.html`
5. Test on different devices and browsers
6. Update the JavaScript if needed for analytics

## 📞 Need Help?

If you need assistance with video integration:
- Check the browser console for errors
- Test on multiple devices
- Ensure video formats are web-compatible
- Contact: bizgrowapp@gmail.com
