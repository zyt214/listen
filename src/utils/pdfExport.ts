import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { message, Modal } from 'ant-design-vue'
import { h } from 'vue'

interface WordItem {
    english: string
    chinese: string
}

export interface ExamRecord {
    id: number
    name: string
    textbookName: string
    wordCount: number
    date: string
    words: WordItem[]
}

// --- 工具函数：生成单页试卷的 HTML ---
export const generateExamPageHTML = (
    record: ExamRecord,
    pageWords: WordItem[],
    options: {
        title: string
        totalCount: number
        currentPage: number
        totalPages: number
        startIndex: number
        isEnglishToChinese: boolean
        showHeader: boolean // 【新增】控制是否显示考生信息栏
    }
) => {
    const { title, totalCount, currentPage, totalPages, startIndex, isEnglishToChinese, showHeader } = options

    return `
    <div style="
      width: 210mm;
      min-height: 297mm;
      padding: ${showHeader ? '15mm' : '20mm'} 20mm 15mm 25mm; /* 如果没有头部，上边距稍微大一点 */
      box-sizing: border-box;
      background: #fff;
      font-family: 'SimSun', 'STSong', 'Songti SC', serif;
      position: relative;
      overflow: hidden;
    ">
      <!-- 左侧密封线 -->
      <div style="
        position: absolute;
        left: 5mm;
        top: 20mm;
        bottom: 20mm;
        width: 1px;
        border-left: 1px dashed #333;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      ">
        <span style="
          writing-mode: vertical-rl;
          text-orientation: mixed;
          font-size: 14px;
          letter-spacing: 4px;
          color: #666;
        ">
          密 封 线 内 不 要 答 题
        </span>
      </div>

      <!-- 【条件渲染】只有第一页显示：头部考生信息 -->
      ${
          showHeader
              ? `
        <div style="
          border: 2px solid #000;
          padding: 10px 15px;
          margin-bottom: 20px;
        ">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 18px; font-weight: bold;">${record.name}</span>
            <span style="font-size: 12px; color: #666;">
              时间：${record.date} | 教材：${record.textbookName}
            </span>
          </div>
          <div style="display: flex; gap: 20px; font-size: 14px;">
            <div>学校：___________</div>
            <div>班级：___________</div>
            <div>姓名：___________</div>
            <div>考号：___________</div>
          </div>
        </div>
      `
              : ''
      }

      <!-- 标题区域 -->
      <div style="text-align: center; margin-bottom: 25px; margin-top: ${showHeader ? '0' : '10px'};">
        <h2 style="
          font-size: 20px;
          margin: 0 0 8px 0;
          font-weight: bold;
          font-family: 'SimHei', 'STHeiti', sans-serif;
        ">
          ${title} (共 ${totalCount} 个单词)
        </h2>
        <div style="font-size: 12px; color: #666;">
          第 ${currentPage} 页 / 共 ${totalPages} 页
        </div>
      </div>

      <!-- 单词答题区域 -->
      <div style="
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 30px;
        row-gap: 16px;
      ">
        ${pageWords
            .map((word, idx) => {
                const num = startIndex + idx + 1
                const content = isEnglishToChinese ? word.english : word.chinese
                const labelFont = isEnglishToChinese ? "font-family: 'Times New Roman', serif; font-style: italic;" : ''

                return `
              <div style="
                display: flex;
                align-items: flex-start;
                border-bottom: 1px solid transparent;
                line-height: 1.2;
              ">
                <span style="
                  width: 30px;
                  font-size: 15px;
                  flex-shrink: 0;
                  text-align: left;
                  padding-bottom: 2px;
                  font-family: 'Times New Roman', serif;
                ">
                  ${num}.
                </span>

                <div style="flex: 1; display: flex; flex-direction: column;">
                  <span style="
                    font-size: 16px;
                    margin-bottom: 2px;
                    ${labelFont}
                    display: inline-block;
                  ">
                    ${content}
                  </span>
                  <div style="
                    height: 22px;
                    border-bottom: 1px solid #333;
                    width: 100%;
                  "></div>
                </div>
              </div>
            `
            })
            .join('')}
      </div>

      <!-- 页脚 -->
      <div style="
        position: absolute;
        bottom: 15mm;
        left: 0;
        right: 0;
        text-align: center;
        font-size: 10px;
        color: #999;
      ">
        © 2026 英语听写系统 | 命题人：AI
      </div>
    </div>
  `
}

// --- 工具函数：将 HTML 元素转为 Canvas 并添加到 PDF ---
export const appendHtmlToPdf = async (pdf: jsPDF, htmlContent: string, isFirstPage: boolean = false) => {
    // 创建临时容器
    const tempContainer = document.createElement('div')
    tempContainer.style.position = 'absolute' // 使用 absolute 避免滚动影响
    tempContainer.style.top = '-9999px'
    tempContainer.style.left = '-9999px'
    tempContainer.style.width = '210mm'
    tempContainer.style.height = '297mm'
    tempContainer.style.backgroundColor = '#ffffff'
    tempContainer.innerHTML = htmlContent
    document.body.appendChild(tempContainer)

    // 等待 DOM 渲染完成
    await new Promise((resolve) => setTimeout(resolve, 300))

    // 渲染 Canvas
    const canvas = await html2canvas(tempContainer, {
        scale: 2, // 2倍清晰度
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        scrollX: 0,
        scrollY: 0,
        windowWidth: tempContainer.scrollWidth,
        windowHeight: tempContainer.scrollHeight,
        letterRendering: true,
        useRetina: true
    })

    // 清理 DOM
    document.body.removeChild(tempContainer)

    // 处理 PDF 分页
    if (!isFirstPage) {
        pdf.addPage()
    }

    // 添加图片 (A4尺寸: 210x297)
    const imgData = canvas.toDataURL('image/png', 1.0)
    pdf.addImage(imgData, 'PNG', 0, 0, 210, 297)
}

// --- 导出 PDF 功能 ---
export const generatePDF = async (record: ExamRecord) => {
    // 显示加载状态的 Modal
    const modalInstance = Modal.info({
        title: '正在导出 PDF',
        content: h(
            'div', // 标签名
            { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0' } }, // 属性对象
            [
                // 子节点数组
                h('div', { style: { fontSize: '48px', marginBottom: '16px' } }, '📄'),
                h('p', { style: { fontSize: '16px', margin: '0 0 8px 0' } }, '正在生成 PDF，请稍候...'),
                h('p', { style: { fontSize: '14px', color: '#666', margin: 0 } }, '导出过程可能需要几秒钟时间')
            ]
        ),
        mask: true,
        closable: false,
        okText: '确定',
        okType: 'default',
        footer: null // 不显示底部按钮
    })

    try {
        const wordsPerPage = 30 // 微调每页数量，配合新布局
        const totalWords = record.words.length
        const halfPoint = Math.ceil(totalWords / 2)

        // 分割单词
        const en2zhWords = record.words.slice(0, halfPoint)
        const zh2enWords = record.words.slice(halfPoint)

        // 初始化 PDF
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        })

        // --- 1. 处理英译汉部分 ---
        const en2zhTotalPages = Math.ceil(en2zhWords.length / wordsPerPage)
        const zh2enTotalPages = Math.ceil(zh2enWords.length / wordsPerPage)
        for (let i = 0; i < en2zhTotalPages; i++) {
            const start = i * wordsPerPage
            const end = Math.min(start + wordsPerPage, en2zhWords.length)
            const pageWords = en2zhWords.slice(start, end)

            const html = generateExamPageHTML(record, pageWords, {
                title: '一、英译汉',
                totalCount: en2zhWords.length,
                currentPage: i + 1,
                showHeader: i === 0,
                totalPages: en2zhTotalPages + zh2enTotalPages, // 这里可以显示总页数，或者只显示部分页数
                startIndex: start,
                isEnglishToChinese: true
            })

            await appendHtmlToPdf(pdf, html, i === 0)
        }

        for (let i = 0; i < zh2enTotalPages; i++) {
            const start = i * wordsPerPage
            const end = Math.min(start + wordsPerPage, zh2enWords.length)
            const pageWords = zh2enWords.slice(start, end)

            // 计算全局页码
            const globalPageNum = en2zhTotalPages + i + 1

            const html = generateExamPageHTML(record, pageWords, {
                title: '二、汉译英',
                totalCount: zh2enWords.length,
                currentPage: globalPageNum,
                showHeader: false,
                totalPages: en2zhTotalPages + zh2enTotalPages,
                startIndex: start, // 如果想让序号接着上一部分，可以用 start + halfPoint
                isEnglishToChinese: false
            })

            await appendHtmlToPdf(pdf, html, false)
        }

        // 保存
        const fileName = `${record.name}_听写试卷_${record.date}.pdf`
        pdf.save(fileName)
        message.success('PDF导出成功')
    } catch (error) {
        console.error('PDF导出失败:', error)
        message.error('PDF导出失败，请重试')
    } finally {
        // 关闭 Modal
        modalInstance.destroy()
    }
}
