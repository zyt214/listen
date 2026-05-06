<template>
  <div class="correction-page">
    <div class="header with-back">
      <a-button type="text" class="back-btn" @click="$emit('back')">
        <LeftOutlined />
      </a-button>
      <h2>批改结果</h2>
    </div>

    <div class="content">
      <div class="result-summary">
        <h3>本次听写结果</h3>
        <div class="result-stats">
          <div class="stat-item">
            <span class="stat-number correct">{{ correctCount }}</span>
            <span class="stat-label">正确</span>
          </div>
          <div class="stat-item">
            <span class="stat-number error">{{ errorCount }}</span>
            <span class="stat-label">错误</span>
          </div>
          <div class="stat-item">
            <span class="stat-number rate">{{ accuracyRate }}%</span>
            <span class="stat-label">正确率</span>
          </div>
        </div>
      </div>

      <div class="error-words" v-if="errorWords.length > 0">
        <h4>错误单词</h4>
        <div class="error-word-list">
          <div v-for="(word, index) in errorWords" :key="index" class="error-word-item">
            <div class="error-word-info">
              <div class="error-word-en">{{ word.english }}</div>
              <div class="error-word-zh">{{ word.chinese }}</div>
            </div>
            <a-checkbox v-model:checked="word.addToErrorBook">
              加入错题本
            </a-checkbox>
          </div>
        </div>
      </div>

      <div class="bottom-buttons">
        <a-button type="primary" block @click="$emit('re-dictation')">
          重新听写
        </a-button>
        <a-button type="default" block @click="$emit('upload-new')">
          上传新图片
        </a-button>
        <a-button type="default" block @click="$emit('view-error-book')">
          查看错题本
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LeftOutlined } from '@ant-design/icons-vue';

interface Word {
  english: string;
  chinese: string;
  addToErrorBook?: boolean;
}

interface Props {
  correctCount: number;
  errorCount: number;
  accuracyRate: number;
  errorWords: Word[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'back'): void;
  (e: 're-dictation'): void;
  (e: 'upload-new'): void;
  (e: 'view-error-book'): void;
}>();
</script>

<style scoped>
.correction-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.header.with-back {
  padding: 20px 24px;
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
  font-size: 20px;
  line-height: 1;
  color: #475569;
}

.back-btn:hover {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.back-btn svg {
  width: 20px;
  height: 20px;
  stroke: currentColor;
}

.header.with-back h2 {
  font-size: 18px;
  margin: 0;
  color: #1e293b;
  font-weight: 700;
  letter-spacing: -0.3px;
}

.content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.result-summary {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
}

.result-summary h3 {
  font-size: 18px;
  margin-bottom: 20px;
  color: #333;
  font-weight: bold;
}

.result-stats {
  display: flex;
  justify-content: space-around;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-number.correct {
  color: #52c41a;
}

.stat-number.error {
  color: #ff4d4f;
}

.stat-number.rate {
  color: #1890ff;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.error-words {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.error-words h4 {
  font-size: 16px;
  margin-bottom: 15px;
  color: #333;
  font-weight: bold;
}

.error-word-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.error-word-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.error-word-item:last-child {
  border-bottom: none;
}

.error-word-info {
  flex: 1;
}

.error-word-en {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.error-word-zh {
  font-size: 14px;
  color: #666;
}

.bottom-buttons {
  position: fixed;
  bottom: 80px;
  left: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.bottom-buttons a-button {
  height: 48px;
  font-size: 16px;
}
</style>