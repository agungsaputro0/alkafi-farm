// components/atoms/SocialIcon.tsx
import { FacebookOutlined, InstagramOutlined, TwitterOutlined, YoutubeOutlined } from '@ant-design/icons';
import React from 'react';

const SocialIcon: React.FC = () => {
  return (
    <div className="social-icons whitespace-nowrap">
      <FacebookOutlined className="cursor-pointer text-2xl mx-2 text-farmbrown hover:text-aqua" />
      <InstagramOutlined className="cursor-pointer text-2xl mx-2 text-farmbrown hover:text-aqua" />
      <TwitterOutlined className="cursor-pointer text-2xl mx-2 text-farmbrown hover:text-aqua" />
      <YoutubeOutlined className="cursor-pointer text-2xl mx-2 text-farmbrown hover:text-aqua" />
    </div>
  );
};

export default SocialIcon;
