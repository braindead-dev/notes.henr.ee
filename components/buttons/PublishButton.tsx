import React from 'react';
import styles from '@/styles/page.module.css';

interface PublishButtonProps {
  handleSubmit?: (e: React.FormEvent) => void;
}

const PublishButton: React.FC<PublishButtonProps> = ({ handleSubmit }) => (
  <button className={styles.publishButton} onClick={handleSubmit}>
    Publish
  </button>
);

export default PublishButton;
