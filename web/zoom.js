let pinchZoomEnabled = false;
function enablePinchZoom(pdfViewer) {
  let startX = 0,
    startY = 0;
  let initialPinchDistance = 0;
  let pinchScale = 1;
  const viewer = document.getElementById("viewer");
  const container = document.getElementById("viewerContainer");
  const reset = () => {
    startX = startY = initialPinchDistance = 0;
    pinchScale = 1;
  };
  // Prevent native iOS page zoom
  //document.addEventListener("touchmove", (e) => { if (e.scale !== 1) { e.preventDefault(); } }, { passive: false });
  document.addEventListener("touchstart", (e) => {
    if (e.touches.length > 1) {
      startX = (e.touches[0].pageX + e.touches[1].pageX) / 2;
      startY = (e.touches[0].pageY + e.touches[1].pageY) / 2;
      initialPinchDistance = Math.hypot(
        e.touches[1].pageX - e.touches[0].pageX,
        e.touches[1].pageY - e.touches[0].pageY
      );
    } else {
      initialPinchDistance = 0;
    }
  });
  document.addEventListener("touchmove", (e) => {
    if (initialPinchDistance <= 0 || e.touches.length < 2) {
      return;
    }
    if (e.scale !== 1) {
      e.preventDefault();
    }
    const pinchDistance = Math.hypot(
      e.touches[1].pageX - e.touches[0].pageX,
      e.touches[1].pageY - e.touches[0].pageY
    );
    const originX = startX + container.scrollLeft;
    const originY = startY + container.scrollTop;
    pinchScale = pinchDistance / initialPinchDistance;
    viewer.style.transform = `scale(${pinchScale})`;
    viewer.style.transformOrigin = `${originX}px ${originY}px`;
  });
  document.addEventListener("touchend", (e) => {
    if (initialPinchDistance <= 0) {
      return;
    }
    viewer.style.transform = `none`;
    viewer.style.transformOrigin = `unset`;
    const pageCenterX =
      this.rootElement.nativeElement.clientWidth / 2 +
      this.rootElement.nativeElement.scrollLeft;
    const pageCenterY =
      this.rootElement.nativeElement.clientHeight / 2 +
      this.rootElement.nativeElement.scrollTop;

    // Compute the next center point in page coordinates
    const centerX = (pageCenterX - this.originX) / pinchScale + this.originX;
    const centerY = (pageCenterY - this.originY) / pinchScale + this.originY;

    // Compute the ratios of the center point to the total scrollWidth/scrollHeight
    const px = centerX / this.rootElement.nativeElement.scrollWidth;
    const py = centerY / this.rootElement.nativeElement.scrollHeight;

    // Scale
    PDFViewerApplication.pdfViewer.currentScale *= pinchScale;

    // Set the scrollbar positions using the percentages and the new scrollWidth/scrollHeight
    this.rootElement.nativeElement.scrollLeft =
      this.rootElement.nativeElement.scrollWidth * px -
      this.rootElement.nativeElement.clientWidth / 2;
    this.rootElement.nativeElement.scrollTop =
      this.rootElement.nativeElement.scrollHeight * py -
      this.rootElement.nativeElement.clientHeight / 2;
    // PDFViewerApplication.pdfViewer.currentScale *= pinchScale;
    // const rect = container.getBoundingClientRect();
    // const dx = startX - rect.left;
    // const dy = startY - rect.top + 32;
    // container.scrollLeft += dx * (pinchScale - 1);
    // container.scrollTop += dy * (pinchScale - 1);
    reset();
    //최종인가염!!
  });
}
document.addEventListener("DOMContentLoaded", () => {
  if (!pinchZoomEnabled) {
    pinchZoomEnabled = true;
    enablePinchZoom();
  }
});
