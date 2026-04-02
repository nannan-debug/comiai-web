import React from 'react';

const sections = [
  {
    title: 'Demo 1 · 禁用态提示',
    desc: '禁用按钮 hover 显示原因：暂无采用分镜，不可点',
  },
  {
    title: 'Demo 2 · 勾选与采用分离',
    desc: '勾选只代表已选，点“采用”才是已采用。',
  },
  {
    title: 'Demo 3 · 导出任务列表',
    desc: '新建/刷新/分页结构统一，避免字号和间距失控。',
  },
  {
    title: 'Demo 4 · 新建导出任务弹窗',
    desc: '地址输入+注释+取消/确认，样式和二级确认弹窗复用。',
  },
  {
    title: 'Demo 5 · 下载确认弹窗',
    desc: '路径单独一行展示，确认后流程结束。',
  },
  {
    title: 'Demo 6 · 分镜号双击编辑',
    desc: '左侧序号固定，分镜号双击可编辑。',
  },
  {
    title: 'Demo 7 · 剧本编辑双态',
    desc: '手动编辑→保存编辑，明确进入和保存动作。',
  },
  {
    title: 'Demo 8 · 字号红线',
    desc: '正文/按钮/表格默认 14px，杜绝“大字报”问题。',
  },
];

export default function UIDemoPage() {
  return (
    <div className="h-screen overflow-auto bg-[#eef0f2] p-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-2xl font-bold text-slate-900">ComiAI UI Demo 预览页</div>
          <div className="text-sm text-slate-500 mt-2">
            这页用于快速评审 UI 规范与交互一致性。主项目继续用原流程页面，不受影响。
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          {sections.map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-base font-bold text-slate-800">{item.title}</div>
              <div className="text-sm text-slate-600 mt-2 leading-6">{item.desc}</div>
              <div className="mt-4">
                <button className="h-9 px-4 rounded-lg text-sm font-semibold ui-btn-dark">查看示例</button>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm mt-4">
          <div className="text-sm font-semibold text-slate-700">评审建议</div>
          <div className="text-sm text-slate-600 mt-2 leading-7">
            1. 是否还有字号偏大的地方。2. 按钮/弹窗是否风格统一。3. 禁用态是否都有 hover 原因提示。
          </div>
        </div>
      </div>
    </div>
  );
}
