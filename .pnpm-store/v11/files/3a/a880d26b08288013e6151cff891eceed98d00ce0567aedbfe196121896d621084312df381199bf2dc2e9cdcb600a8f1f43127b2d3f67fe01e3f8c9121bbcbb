const positionChannel = /* @__PURE__ */ Symbol();
function readMaterializedPositionChannel(name, channel) {
  if (name === "x" || name === "y") return name;
  return channel[positionChannel];
}
function preserveMaterializedPositionChannel(name, channel) {
  const position = readMaterializedPositionChannel(name, channel);
  if (position === void 0) return channel;
  if (channel[positionChannel] === position) {
    return channel;
  }
  const positioned = {
    ...channel,
    [positionChannel]: position
  };
  return positioned;
}
export {
  preserveMaterializedPositionChannel,
  readMaterializedPositionChannel
};
