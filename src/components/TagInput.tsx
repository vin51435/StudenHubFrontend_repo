import React, { useState } from 'react';
import { Input, Tag } from 'antd';

interface TagInputProps {
  value?: string[];
  onChange?: (tags: string[]) => void;
  maxTags?: number;
  placeholder?: string;
}

const TagInput: React.FC<TagInputProps> = ({
  value = [],
  onChange,
  maxTags = 5,
  placeholder = 'Add tags',
}) => {
  const [input, setInput] = useState('');

  const triggerChange = (newTags: string[]) => {
    onChange?.(newTags);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      const newTag = input.trim();
      if (newTag && !value.includes(newTag) && value.length < maxTags) {
        const updated = [...value, newTag];
        triggerChange(updated);
      }
      setInput('');
    }
  };

  const handleRemove = (removedTag: string) => {
    const updated = value.filter((tag) => tag !== removedTag);
    triggerChange(updated);
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '4px 0' }}>
      {value.map((tag) => (
        <Tag className="!h-fit" key={tag} closable onClose={() => handleRemove(tag)}>
          {tag}
        </Tag>
      ))}
      {value.length < maxTags && (
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          style={{ width: 200 }}
        />
      )}
    </div>
  );
};

export default TagInput;
