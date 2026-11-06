import { resolveRectCornerRadii } from "./renderer-rect.js";
import { rectCornerRadiiPath, resolveRectCornerRadii as resolveRectCornerRadii2 } from "./renderer-rect.js";
const fullTurn = Math.PI * 2;
function containsRectCornerRadii(x, y, width, height, cornerRadii, pointX, pointY) {
  const bounds = rectBounds(x, y, width, height);
  const left = bounds.x;
  const top = bounds.y;
  const right = left + bounds.width;
  const bottom = top + bounds.height;
  if (!(pointX >= left && pointX <= right && pointY >= top && pointY <= bottom)) {
    return false;
  }
  const [topLeft, topRight, bottomRight, bottomLeft] = resolveRectCornerRadii(
    cornerRadii,
    bounds.width,
    bounds.height
  );
  if (pointX < left + topLeft && pointY < top + topLeft) {
    return insideCircle(pointX, pointY, left + topLeft, top + topLeft, topLeft);
  }
  if (pointX > right - topRight && pointY < top + topRight) {
    return insideCircle(
      pointX,
      pointY,
      right - topRight,
      top + topRight,
      topRight
    );
  }
  if (pointX > right - bottomRight && pointY > bottom - bottomRight) {
    return insideCircle(
      pointX,
      pointY,
      right - bottomRight,
      bottom - bottomRight,
      bottomRight
    );
  }
  if (pointX < left + bottomLeft && pointY > bottom - bottomLeft) {
    return insideCircle(
      pointX,
      pointY,
      left + bottomLeft,
      bottom - bottomLeft,
      bottomLeft
    );
  }
  return true;
}
function squaredDistanceToRectCornerRadii(x, y, width, height, cornerRadii, pointX, pointY) {
  if (containsRectCornerRadii(x, y, width, height, cornerRadii, pointX, pointY)) {
    return 0;
  }
  const bounds = rectBounds(x, y, width, height);
  const left = bounds.x;
  const top = bounds.y;
  const right = left + bounds.width;
  const bottom = top + bounds.height;
  const [topLeft, topRight, bottomRight, bottomLeft] = resolveRectCornerRadii(
    cornerRadii,
    bounds.width,
    bounds.height
  );
  return Math.min(
    squaredDistanceToSegment(
      left + topLeft,
      top,
      right - topRight,
      top,
      pointX,
      pointY
    ),
    squaredDistanceToSegment(
      right,
      top + topRight,
      right,
      bottom - bottomRight,
      pointX,
      pointY
    ),
    squaredDistanceToSegment(
      right - bottomRight,
      bottom,
      left + bottomLeft,
      bottom,
      pointX,
      pointY
    ),
    squaredDistanceToSegment(
      left,
      bottom - bottomLeft,
      left,
      top + topLeft,
      pointX,
      pointY
    ),
    squaredDistanceToArc(
      pointX,
      pointY,
      left + topLeft,
      top + topLeft,
      topLeft,
      Math.PI,
      Math.PI * 1.5
    ),
    squaredDistanceToArc(
      pointX,
      pointY,
      right - topRight,
      top + topRight,
      topRight,
      Math.PI * 1.5,
      fullTurn
    ),
    squaredDistanceToArc(
      pointX,
      pointY,
      right - bottomRight,
      bottom - bottomRight,
      bottomRight,
      0,
      Math.PI * 0.5
    ),
    squaredDistanceToArc(
      pointX,
      pointY,
      left + bottomLeft,
      bottom - bottomLeft,
      bottomLeft,
      Math.PI * 0.5,
      Math.PI
    )
  );
}
function rectBounds(x, y, width, height) {
  const right = x + width;
  const bottom = y + height;
  return {
    x: Math.min(x, right),
    y: Math.min(y, bottom),
    width: Math.abs(width),
    height: Math.abs(height)
  };
}
function insideCircle(x, y, centerX, centerY, radius) {
  const dx = x - centerX;
  const dy = y - centerY;
  return dx * dx + dy * dy <= radius * radius;
}
function squaredDistanceToArc(x, y, centerX, centerY, radius, startAngle, endAngle) {
  if (radius === 0) return squaredDistance(x, y, centerX, centerY);
  let angle = Math.atan2(y - centerY, x - centerX);
  if (angle < 0) angle += fullTurn;
  if (angle >= startAngle && angle <= endAngle) {
    const centerDistance = Math.hypot(x - centerX, y - centerY);
    return (centerDistance - radius) ** 2;
  }
  return Math.min(
    squaredDistance(
      x,
      y,
      centerX + Math.cos(startAngle) * radius,
      centerY + Math.sin(startAngle) * radius
    ),
    squaredDistance(
      x,
      y,
      centerX + Math.cos(endAngle) * radius,
      centerY + Math.sin(endAngle) * radius
    )
  );
}
function squaredDistanceToSegment(x1, y1, x2, y2, x, y) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared === 0) return squaredDistance(x, y, x1, y1);
  const amount = Math.max(
    0,
    Math.min(1, ((x - x1) * dx + (y - y1) * dy) / lengthSquared)
  );
  return squaredDistance(x, y, x1 + amount * dx, y1 + amount * dy);
}
function squaredDistance(x1, y1, x2, y2) {
  return (x1 - x2) ** 2 + (y1 - y2) ** 2;
}
export {
  containsRectCornerRadii,
  rectCornerRadiiPath,
  resolveRectCornerRadii2 as resolveRectCornerRadii,
  squaredDistanceToRectCornerRadii
};
