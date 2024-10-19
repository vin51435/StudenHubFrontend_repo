export const getValueByKey = (obj, key) => {
  if (Object.prototype.hasOwnProperty.call(obj, key)) {
    return obj[key];
  } else {
    throw new Error(`Key "${key}" not found in the object.`);
  }
};

export function generateChatId(userId1, userId2) {
  const sortedIds = [userId1, userId2].sort();
  return `${sortedIds[0]}_${sortedIds[1]}`;
}

export function generateGroupChatId(groupName) {
  return groupName.replace(/\s+/g, '_').toLowerCase();
}