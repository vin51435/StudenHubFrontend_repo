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

  const tryAddTag = () => {
    const newTag = input.trim();
    if (newTag && !value.includes(newTag) && value.length < maxTags) {
      triggerChange([...value, newTag]);
    }
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      tryAddTag();
    }
  };

  const handleBlur = () => {
    tryAddTag();
  };

  const handleRemove = (removedTag: string) => {
    triggerChange(value.filter((tag) => tag !== removedTag));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // If user types a space at end and it's not empty
    if (newValue.endsWith(' ')) {
      const trimmed = newValue.trim();
      if (trimmed && !value.includes(trimmed) && value.length < maxTags) {
        triggerChange([...value, trimmed]);
      }
      setInput('');
    } else {
      setInput(newValue);
    }
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '4px 0' }}>
      {value.map((tag) => (
        <Tag className="!h-full" key={tag} closable onClose={() => handleRemove(tag)}>
          {tag}
        </Tag>
      ))}
      {value.length < maxTags && (
        <Input
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={placeholder}
          style={{ width: 200 }}
        />
      )}
    </div>
  );
};

export default TagInput;
