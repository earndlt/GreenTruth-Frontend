
/**
 * Creates a tooltip element for a delivery point
 */
export const createTooltipElement = (pointName: string): HTMLElement => {
  const tooltipElement = document.createElement('div');
  tooltipElement.className = 'point-tooltip';
  tooltipElement.style.display = 'none'; // Start hidden
  tooltipElement.style.position = 'absolute';
  tooltipElement.style.zIndex = '1000';
  tooltipElement.style.pointerEvents = 'none'; // Allow clicks to pass through
  tooltipElement.innerHTML = `
    <div style="
      background-color: rgba(255, 255, 255, 0.95);
      color: #1A1F2C;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      border: 1px solid #aaadb0;
      pointer-events: none;
      max-width: 200px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      transform: translate(-50%, -100%);
      margin-top: -8px;">
      ${pointName}
    </div>
  `;
  
  // Add the tooltip to the map container rather than body
  return tooltipElement;
};
