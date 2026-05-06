<template>
  <div class="word-list-page">
    <div class="header with-back">
      <a-button type="text" class="back-btn" @click="$emit('back')">
        <LeftOutlined />
      </a-button>
      <h2>单词列表</h2>
    </div>

    <div class="content">
      <div class="word-count">
        本次共 {{ words.length }} 个单词
      </div>

      <div class="settings">
        <div class="setting-item">
          <span>播报顺序：</span>
          <a-radio-group v-model:value="playOrder" size="small">
            <a-radio value="original">原顺序</a-radio>
            <a-radio value="shuffled">打乱</a-radio>
          </a-radio-group>
        </div>

        <div class="setting-item">
          <span>翻译方向：</span>
          <a-radio-group v-model:value="translateDirection" size="small">
            <a-radio value="en2zh">英译汉</a-radio>
            <a-radio value="zh2en">汉译英</a-radio>
          </a-radio-group>
        </div>
      </div>

      <div class="word-list">
        <div v-for="(word, index) in words" :key="index" class="word-item">
          <div class="word-info">
            <div class="word-en">{{ word.english }}</div>
            <div class="word-zh">{{ word.chinese }}</div>
          </div>
          <a-button type="text" class="delete-btn" @click="$emit('delete-word', index)">×</a-button>
        </div>
      </div>

      <div class="batch-actions">
        <a-checkbox v-model:checked="selectAll">全选</a-checkbox>
        <a-button type="text" @click="$emit('batch-delete')">批量删除</a-button>
      </div>

      <div class="bottom-buttons">
        <a-button type="primary" block @click="$emit('start-dictation', playOrder, translateDirection)">
          开始听写
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { LeftOutlined } from '@ant-design/icons-vue';

interface Word {
  english: string;
  chinese: string;
}

interface Props {
  words: Word[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'back'): void;
  (e: 'delete-word', index: number): void;
  (e: 'batch-delete'): void;
  (e: 'start-dictation', playOrder: string, translateDirection: string): void;
}>();

const playOrder = ref('original');
const translateDirection = ref('en2zh');
const selectAll = ref(false);
</script>

<style scoped>
.word-list-page {
  min-height: 100vh;
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

.word-count {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
}

.settings {
  background: #fff;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.setting-item {
  margin-bottom: 15px;
}

.setting-item:last-child {
  margin-bottom: 0;
}

.setting-item span {
  display: inline-block;
  width: 80px;
  font-size: 14px;
  color: #333;
}

.word-list {
  background: #fff;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.word-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.word-item:last-child {
  border-bottom: none;
}

.word-info {
  flex: 1;
}

.word-en {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.word-zh {
  font-size: 14px;
  color: #666;
}

.delete-btn {
  color: #ff4d4f;
  font-size: 20px;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.batch-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.bottom-buttons {
  position: fixed;
  bottom: 80px;
  left: 20px;
  right: 20px;
}

.bottom-buttons a-button {
  height: 48px;
  font-size: 16px;
}
</style>