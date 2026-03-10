const {
  useState,
  useEffect
} = React;

// --- 選項資料 (整理自 CSV) ---
const DEFAULT_OPTIONS = {
  visitType: ["初評", "復評"],
  referrer: ["案家人協助", "服務單位協助", "個案"],
  participants: ["個案", "案家人", "個管師"],
  // 複選
  gender: ["男", "女"],
  welfare: ["第一類", "第二類", "第三類"],
  disability: ["具身障證明", "無身障證明"],
  foreignCare: ["聘僱有外籍看護", "未聘僱外籍看護"],
  marriage: ["已婚", "喪偶", "離婚", "未婚", "再婚"],
  children: ["無子女", "育有子女"],
  livingWith: ["案夫", "案妻", "案子", "案女", "案孫", "案媳", "朋友", "其他"],
  memo1Options: ["另未同住子女，可適時返回探視、協助，整體家庭支持可。", "另未同住子女，因故較少返回探視、協助。"],
  diseases: ["高血壓", "糖尿病", "高血脂", "心臟疾病", "骨科疾病", "退化性關節炎", "骨質疏鬆", "脊椎神經壓迫", "脊椎滑脫", "骨折", "癌症", "中風", "便祕", "攝護腺疾病", "帕金森氏症", "失智症", "睡眠障礙"],
  // 複選
  escort: ["案夫", "案妻", "案子", "案女", "外看", "個案", "居服人員", "朋友", "其他"],
  // 複選
  hospital: ["新竹台大醫院", "新竹馬偕醫院", "新竹國泰醫院", "新竹國軍醫院", "南門醫院", "安慎診所", "OO診所"],
  consciousness: ["意識清楚", "意識混亂", "嗜睡", "叫喚無反應，呈木僵態"],
  communication: ["可溝通對答", "可簡單對答", "加大音量，可溝通對答", "加大音量，可簡單對答，過程需重複確認"],
  disabilityReason: ["疾病", "年老退化", "體況衰弱", "認知功能退化"],
  actionStatus: ["緩慢", "不易", "受限", "困難"],
  actionItems: ["進食", "沐浴", "個人修飾", "穿脫衣物", "大小便控制", "如廁", "移位", "行走", "上下樓梯"],
  // 複選
  toileting: ["具備如廁意識，可自行如廁", "具備如廁意識，需他人協助如廁", "具備如廁意識，惟大便偶有失控", "具備如廁意識，惟大便偶有失控，使用尿布輔助"],
  transferring: ["可自行起身移位", "起身移位緩慢", "起身移位不易、欠穩", "起身移不易，需他人適時扶持"],
  walking: ["可自行行走", "會使用拐杖輔助行走", "會使用助行器輔助行走", "行走皆以輪椅代步", "步態緩慢", "步態欠穩", "步態欠穩，需他人陪同"],
  // 可複選
  stairs: ["可扶持扶手上、下階梯。", "上下樓梯欠穩，需他人陪同、維護安全。", "上下樓梯困難，需他人攙扶、維護安全。", "無法上下階梯"],
  housingType: ["透天厝、無電梯", "透天厝、有電梯", "公寓、無電梯", "華廈、具電梯", "社區式電梯大樓"],
  livingEnvironment: ["居住環境未構成障礙", "居住環境具部分障礙，包含:臥室、走道、浴廁、出入口", "居住環境具部分安全疑慮，包含:臥室、走道、浴廁、出入口"],
  serviceItems: ["照顧服務", "專業服務", "交通接送", "輔助補助", "居家無障礙環境改善", "喘息服務"],
  // 複選
  careNeed: ["評估本案家庭照顧者，未符合轉介指標，爰請個管師持續追蹤關懷，倘照顧情況改變，可視需求轉介家照服務。", "評估本案家庭照顧者，符合轉介指標，經詢主要照顧者，無意願轉介，爰請個管師持續追蹤關懷，倘照顧情況改變，可視需求轉介家照服務。", "評估本案家庭照顧者，符合轉介指標，經詢主要照顧者，有意願轉介，爰請個管師協助轉介。"],
  dispatchPrinciple: ["輪派", "案家指定"],
  aUnit: ["財團法人天主教耶穌會新竹社會服務中心", "社團法人中華民國士林靈糧堂社會福利協會", "財團法人老五老基金會", "順順居家護理所", "國泰醫療財團法人新竹國泰綜合醫院"]
};

// --- 共用 UI 元件 ---
const SectionCard = ({
  title,
  children
}) => /*#__PURE__*/React.createElement("div", {
  className: "bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6"
}, /*#__PURE__*/React.createElement("h2", {
  className: "text-xl font-bold text-gray-800 border-b-2 border-blue-500 pb-2 mb-4"
}, title), /*#__PURE__*/React.createElement("div", {
  className: "space-y-4"
}, children));
const RadioGroup = ({
  label,
  name,
  options,
  value,
  onChange,
  required = false
}) => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
  className: "block text-sm font-medium text-gray-700 mb-1"
}, label, " ", required && /*#__PURE__*/React.createElement("span", {
  className: "text-red-500"
}, "*")), /*#__PURE__*/React.createElement("div", {
  className: "flex flex-wrap gap-3"
}, options.map(opt => /*#__PURE__*/React.createElement("label", {
  key: opt,
  className: `flex items-center p-2 border rounded cursor-pointer transition-colors ${value === opt ? 'bg-blue-50 border-blue-400' : 'bg-gray-50 hover:bg-gray-100'}`
}, /*#__PURE__*/React.createElement("input", {
  type: "radio",
  name: name,
  value: opt,
  checked: value === opt,
  onChange: onChange,
  className: "text-blue-600 focus:ring-blue-500 mr-2"
}), /*#__PURE__*/React.createElement("span", {
  className: "text-sm text-gray-800"
}, opt)))));
const CheckboxGroup = ({
  label,
  name,
  options,
  values = [],
  onChange
}) => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
  className: "block text-sm font-medium text-gray-700 mb-1"
}, label, " ", /*#__PURE__*/React.createElement("span", {
  className: "text-xs text-blue-500 font-normal ml-2"
}, "(\u53EF\u8907\u9078)")), /*#__PURE__*/React.createElement("div", {
  className: "flex flex-wrap gap-3"
}, options.map(opt => /*#__PURE__*/React.createElement("label", {
  key: opt,
  className: `flex items-center p-2 border rounded cursor-pointer transition-colors ${values.includes(opt) ? 'bg-green-50 border-green-400' : 'bg-gray-50 hover:bg-gray-100'}`
}, /*#__PURE__*/React.createElement("input", {
  type: "checkbox",
  checked: values.includes(opt),
  onChange: e => onChange(name, opt, e.target.checked),
  className: "text-green-600 focus:ring-green-500 mr-2 rounded"
}), /*#__PURE__*/React.createElement("span", {
  className: "text-sm text-gray-800"
}, opt)))));

// 輔助函數：格式化輸出文字
const f = (val, fallback = "______") => {
  if (Array.isArray(val)) {
    return val.length > 0 ? /*#__PURE__*/React.createElement("span", {
      className: "highlight-input"
    }, val.join("、")) : /*#__PURE__*/React.createElement("span", {
      className: "text-gray-400"
    }, fallback);
  }
  return val ? /*#__PURE__*/React.createElement("span", {
    className: "highlight-input"
  }, val) : /*#__PURE__*/React.createElement("span", {
    className: "text-gray-400"
  }, fallback);
};
const formatDate = dateStr => {
  if (!dateStr) return "___年___月___日";
  const d = new Date(dateStr);
  return `${d.getFullYear() - 1911}年${d.getMonth() + 1}月${d.getDate()}日`;
};
const OPTIONS_LABELS = {
  visitType: "訪視類別",
  referrer: "轉介人員",
  participants: "訪視參與人員",
  gender: "性別",
  welfare: "身分福利別",
  disability: "身障證明",
  foreignCare: "外看聘僱情形",
  marriage: "婚姻狀況",
  children: "生育情況",
  livingWith: "同住家人",
  memo1Options: "備註(同住子女狀況等)",
  diseases: "疾病項目",
  escort: "就醫陪同人員",
  hospital: "就診醫療單位",
  consciousness: "意識情形",
  communication: "溝通能力",
  disabilityReason: "失能原因",
  actionStatus: "執行情形",
  actionItems: "日常活動項目",
  toileting: "如廁能力",
  transferring: "移位情形",
  walking: "行走情形",
  stairs: "上下樓梯",
  housingType: "住所類型",
  livingEnvironment: "居住環境",
  serviceItems: "期待服務項目",
  careNeed: "家照需求",
  dispatchPrinciple: "派案原則",
  aUnit: "A單位"
};
const SettingsModal = ({
  isOpen,
  onClose,
  options,
  setOptions,
  onExport,
  onImport
}) => {
  if (!isOpen) return null;
  const [localOptions, setLocalOptions] = useState(options);
  const [activeTab, setActiveTab] = useState(Object.keys(options)[0]);
  useEffect(() => {
    setLocalOptions(options);
  }, [options]);
  const handleSave = () => {
    setOptions(localOptions);
    onClose();
  };
  const handleReset = () => {
    if (confirm("確定要重設為系統預設選項嗎？這會覆蓋目前的設定。")) {
      setOptions(DEFAULT_OPTIONS);
      setLocalOptions(DEFAULT_OPTIONS);
    }
  };
  const handleTextChange = e => {
    const text = e.target.value;
    const newArray = text.split('\n').filter(item => item.trim() !== '');
    setLocalOptions(prev => ({
      ...prev,
      [activeTab]: newArray
    }));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 no-print"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-xl shadow-xl w-[800px] max-w-[90vw] max-h-[90vh] flex flex-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-xl"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-bold text-gray-800"
  }, "\u9078\u9805\u8CC7\u6599\u7BA1\u7406"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "text-gray-500 hover:text-gray-800"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-6 h-6",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M6 18L18 6M6 6l12 12"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-1 overflow-hidden min-h-[400px]"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-1/3 border-r bg-gray-50 overflow-y-auto p-2"
  }, Object.keys(localOptions).map(key => /*#__PURE__*/React.createElement("button", {
    key: key,
    onClick: () => setActiveTab(key),
    className: `w-full text-left p-3 rounded mb-1 transition-colors ${activeTab === key ? 'bg-blue-100 text-blue-700 font-bold' : 'hover:bg-gray-200 text-gray-700'}`
  }, OPTIONS_LABELS[key] || key))), /*#__PURE__*/React.createElement("div", {
    className: "w-2/3 p-6 flex flex-col"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-bold mb-2"
  }, OPTIONS_LABELS[activeTab] || activeTab), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-500 mb-4"
  }, "\u8ACB\u5728\u4E0B\u65B9\u7DE8\u8F2F\u9078\u9805\uFF0C\u6BCF\u4E00\u884C\u4EE3\u8868\u4E00\u500B\u9078\u9805\u3002"), /*#__PURE__*/React.createElement("textarea", {
    className: "flex-1 w-full border rounded p-3 focus:ring-blue-500 focus:border-blue-500",
    value: (localOptions[activeTab] || []).join('\n'),
    onChange: handleTextChange
  }))), /*#__PURE__*/React.createElement("div", {
    className: "p-4 border-t bg-gray-50 rounded-b-xl flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: handleReset,
    className: "px-4 py-2 text-red-600 hover:bg-red-50 rounded border border-red-200 transition-colors text-sm"
  }, "\u91CD\u8A2D\u70BA\u9810\u8A2D"), /*#__PURE__*/React.createElement("button", {
    onClick: onExport,
    className: "px-4 py-2 text-blue-600 hover:bg-blue-50 rounded border border-blue-200 transition-colors text-sm"
  }, "\u532F\u51FA\u8A2D\u5B9A (.json)"), /*#__PURE__*/React.createElement("label", {
    className: "cursor-pointer px-4 py-2 text-blue-600 hover:bg-blue-50 rounded border border-blue-200 transition-colors text-sm"
  }, "\u532F\u5165\u8A2D\u5B9A", /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: ".json",
    onChange: onImport,
    className: "hidden"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-800 transition-colors"
  }, "\u53D6\u6D88"), /*#__PURE__*/React.createElement("button", {
    onClick: handleSave,
    className: "px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-bold transition-colors"
  }, "\u5132\u5B58\u8B8A\u66F4")))));
};
const App = () => {
  const [options, setOptions] = useState(() => {
    try {
      const saved = localStorage.getItem('longterm_visit_options');
      return saved ? JSON.parse(saved) : DEFAULT_OPTIONS;
    } catch (e) {
      return DEFAULT_OPTIONS;
    }
  });
  const [showSettings, setShowSettings] = useState(false);
  useEffect(() => {
    localStorage.setItem('longterm_visit_options', JSON.stringify(options));
  }, [options]);
  const handleExportSettings = () => {
    const blob = new Blob([JSON.stringify(options, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `訪視選項設定_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };
  const handleImportSettings = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      try {
        const importedOptions = JSON.parse(event.target.result);
        setOptions(importedOptions);
        alert('設定匯入成功！');
      } catch (error) {
        alert('檔案格式錯誤，匯入失敗。');
      }
      e.target.value = ''; // clear input
    };
    reader.readAsText(file);
  };

  // --- 表單狀態 ---

  const [data, setData] = useState({
    visitDate: new Date().toISOString().split('T')[0],
    visitType: "",
    referrer: "",
    participants: [],
    age: "",
    gender: "",
    welfare: "",
    disability: "",
    foreignCare: "",
    marriage: "",
    children: "",
    livingWith: [],
    mainCaregiver: "",
    memo1: "",
    diseases: [],
    diseasesOther: "",
    escort: [],
    hospital: "",
    pastDiseases: "",
    consciousness: "",
    communication: "",
    disabilityReason: [],
    actionStatus: [],
    actionItems: [],
    toileting: "",
    transferring: "",
    walking: [],
    stairs: "",
    housingType: "",
    livingEnvironment: "",
    serviceItems: [],
    careNeed: "",
    careLevel: "",
    dispatchPrinciple: "",
    aUnit: "",
    finalMemo: ""
  });

  // 處理單一值變更
  const handleChange = e => {
    const {
      name,
      value
    } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 處理複選陣列變更
  const handleArrayChange = (name, value, isChecked) => {
    setData(prev => {
      const currentArray = prev[name] || [];
      if (isChecked) {
        return {
          ...prev,
          [name]: [...currentArray, value]
        };
      } else {
        return {
          ...prev,
          [name]: currentArray.filter(item => item !== value)
        };
      }
    });
  };

  // 列印功能
  const handlePrint = () => {
    window.print();
  };

  // 匯出 Word 功能
  const handleExportWord = () => {
    const content = document.getElementById('export-content').innerHTML;
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>新案訪視紀錄</title><style>@page WordSection1 { margin: 1.27cm 1.27cm 1.27cm 1.27cm; } div.WordSection1 { page: WordSection1; } body { font-family: '標楷體', 'BiauKai', 'DFKai-SB', serif; font-size: 16px; line-height: 28px; } h3 { font-size: 16px; font-weight: bold; margin-top: 1.5em; margin-bottom: 0.5em; } p { margin-bottom: 0.5em; text-align: justify; } .highlight-input { font-weight: bold; }</style></head><body><div class='WordSection1'>";
    const footer = "</div></body></html>";
    const sourceHTML = header + content + footer;
    const blob = new Blob(['\ufeff', sourceHTML], {
      type: 'application/msword'
    });
    const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = url;
    fileDownload.download = `新案訪視紀錄_${formatDate(data.visitDate)}.doc`;
    fileDownload.click();
    document.body.removeChild(fileDownload);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen min-w-[1024px] print:min-h-0 print:min-w-0 print:bg-white"
  }, /*#__PURE__*/React.createElement("nav", {
    className: "bg-white shadow-sm p-4 sticky top-0 z-10 no-print flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-blue-600 p-2 rounded-lg mr-3"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-6 h-6 text-white",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
  }))), /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl font-bold text-gray-800"
  }, "\u65B0\u6848\u8A2A\u8996\u7D00\u9304\u7CFB\u7D71")), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowSettings(true),
    className: "bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg shadow flex items-center transition-colors"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5 mr-2",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
  }), /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
  })), "\u9078\u9805\u7BA1\u7406"), /*#__PURE__*/React.createElement("button", {
    onClick: handleExportWord,
    className: "bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow flex items-center transition-colors"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5 mr-2",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
  })), "\u532F\u51FA Word"), /*#__PURE__*/React.createElement("button", {
    onClick: handlePrint,
    className: "bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow flex items-center transition-colors"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5 mr-2",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
  })), "\u5217\u5370 / \u5132\u5B58\u70BA PDF"))), /*#__PURE__*/React.createElement("div", {
    className: "max-w-7xl mx-auto p-4 flex flex-row gap-6 print:block print:p-0 print:m-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-1/2 no-print space-y-6"
  }, /*#__PURE__*/React.createElement(SectionCard, {
    title: "\u57FA\u672C\u8CC7\u8A0A\u8207\u8F49\u5165\u4F86\u6E90"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-sm font-medium text-gray-700 mb-1"
  }, "\u8A2A\u8996\u65E5\u671F"), /*#__PURE__*/React.createElement("input", {
    type: "date",
    name: "visitDate",
    value: data.visitDate,
    onChange: handleChange,
    className: "w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
  })), /*#__PURE__*/React.createElement(RadioGroup, {
    label: "\u8A2A\u8996\u985E\u5225",
    name: "visitType",
    options: options.visitType,
    value: data.visitType,
    onChange: handleChange
  })), /*#__PURE__*/React.createElement(RadioGroup, {
    label: "\u8F49\u4ECB\u4EBA\u54E1",
    name: "referrer",
    options: options.referrer,
    value: data.referrer,
    onChange: handleChange
  }), /*#__PURE__*/React.createElement(CheckboxGroup, {
    label: "\u8A2A\u8996\u53C3\u8207\u4EBA\u54E1",
    name: "participants",
    options: options.participants,
    values: data.participants,
    onChange: handleArrayChange
  })), /*#__PURE__*/React.createElement(SectionCard, {
    title: "1. \u500B\u6848\u6458\u8981"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-sm font-medium text-gray-700 mb-1"
  }, "\u5E74\u9F61"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    name: "age",
    value: data.age,
    onChange: handleChange,
    className: "w-full p-2 border rounded",
    placeholder: "\u6B72"
  })), /*#__PURE__*/React.createElement(RadioGroup, {
    label: "\u6027\u5225",
    name: "gender",
    options: options.gender,
    value: data.gender,
    onChange: handleChange
  })), /*#__PURE__*/React.createElement(RadioGroup, {
    label: "\u8EAB\u5206\u798F\u5229\u5225",
    name: "welfare",
    options: options.welfare,
    value: data.welfare,
    onChange: handleChange
  }), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement(RadioGroup, {
    label: "\u8EAB\u969C\u8B49\u660E",
    name: "disability",
    options: options.disability,
    value: data.disability,
    onChange: handleChange
  }), /*#__PURE__*/React.createElement(RadioGroup, {
    label: "\u5916\u770B\u8058\u50F1\u60C5\u5F62",
    name: "foreignCare",
    options: options.foreignCare,
    value: data.foreignCare,
    onChange: handleChange
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement(RadioGroup, {
    label: "\u5A5A\u59FB\u72C0\u6CC1",
    name: "marriage",
    options: options.marriage,
    value: data.marriage,
    onChange: handleChange
  }), /*#__PURE__*/React.createElement(RadioGroup, {
    label: "\u751F\u80B2\u60C5\u6CC1",
    name: "children",
    options: options.children,
    value: data.children,
    onChange: handleChange
  })), /*#__PURE__*/React.createElement(CheckboxGroup, {
    label: "\u540C\u4F4F\u5BB6\u4EBA",
    name: "livingWith",
    options: options.livingWith,
    values: data.livingWith,
    onChange: handleArrayChange
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-sm font-medium text-gray-700 mb-1"
  }, "\u4E3B\u8981\u7167\u9867\u8005 (\u8ACB\u624B\u52D5\u8F38\u5165)"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "mainCaregiver",
    value: data.mainCaregiver,
    onChange: handleChange,
    className: "w-full p-2 border rounded",
    placeholder: "\u4F8B\u5982\uFF1A\u6848\u5973\u3001\u5916\u7C4D\u770B\u8B77\u7B49"
  })), /*#__PURE__*/React.createElement(RadioGroup, {
    label: "\u5099\u8A3B (\u540C\u4F4F\u5B50\u5973\u72C0\u6CC1\u7B49)",
    name: "memo1",
    options: options.memo1Options,
    value: data.memo1,
    onChange: handleChange
  })), /*#__PURE__*/React.createElement(SectionCard, {
    title: "2. \u91AB\u7642\u8207\u75BE\u75C5"
  }, /*#__PURE__*/React.createElement(CheckboxGroup, {
    label: "\u75BE\u75C5\u9805\u76EE",
    name: "diseases",
    options: options.diseases,
    values: data.diseases,
    onChange: handleArrayChange
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-sm font-medium text-gray-700 mb-1"
  }, "\u75BE\u75C5\u5176\u4ED6\u5099\u8A3B (\u5982\uFF1A\u7279\u5B9A\u90E8\u4F4D\u9AA8\u6298)"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "diseasesOther",
    value: data.diseasesOther,
    onChange: handleChange,
    className: "w-full p-2 border rounded",
    placeholder: "\u82E5\u4E0A\u65B9\u6709\u52FE\u9078\u9AA8\u6298\u6216\u764C\u75C7\u7B49\uFF0C\u8ACB\u5728\u6B64\u88DC\u5145"
  })), /*#__PURE__*/React.createElement(CheckboxGroup, {
    label: "\u5C31\u91AB\u966A\u540C\u4EBA\u54E1",
    name: "escort",
    options: options.escort,
    values: data.escort,
    onChange: handleArrayChange
  }), /*#__PURE__*/React.createElement(RadioGroup, {
    label: "\u5C31\u8A3A\u91AB\u7642\u55AE\u4F4D",
    name: "hospital",
    options: options.hospital,
    value: data.hospital,
    onChange: handleChange
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-sm font-medium text-gray-700 mb-1"
  }, "\u904E\u5F80\u75BE\u75C5\u53F2"), /*#__PURE__*/React.createElement("textarea", {
    name: "pastDiseases",
    value: data.pastDiseases,
    onChange: handleChange,
    rows: "2",
    className: "w-full p-2 border rounded",
    placeholder: "\u500B\u6848\u53E6\u6709..."
  }))), /*#__PURE__*/React.createElement(SectionCard, {
    title: "3. \u65E5\u5E38\u6D3B\u52D5\u8207\u72C0\u614B"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement(RadioGroup, {
    label: "\u610F\u8B58\u60C5\u5F62",
    name: "consciousness",
    options: options.consciousness,
    value: data.consciousness,
    onChange: handleChange
  }), /*#__PURE__*/React.createElement(RadioGroup, {
    label: "\u6E9D\u901A\u80FD\u529B",
    name: "communication",
    options: options.communication,
    value: data.communication,
    onChange: handleChange
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement(CheckboxGroup, {
    label: "\u5931\u80FD\u539F\u56E0",
    name: "disabilityReason",
    options: options.disabilityReason,
    values: data.disabilityReason,
    onChange: handleArrayChange
  }), /*#__PURE__*/React.createElement(CheckboxGroup, {
    label: "\u57F7\u884C\u60C5\u5F62",
    name: "actionStatus",
    options: options.actionStatus,
    values: data.actionStatus,
    onChange: handleArrayChange
  })), /*#__PURE__*/React.createElement(CheckboxGroup, {
    label: "\u9808\u5354\u52A9\u57F7\u884C\u9805\u76EE",
    name: "actionItems",
    options: options.actionItems,
    values: data.actionItems,
    onChange: handleArrayChange
  }), /*#__PURE__*/React.createElement(RadioGroup, {
    label: "\u5982\u5EC1\u80FD\u529B",
    name: "toileting",
    options: options.toileting,
    value: data.toileting,
    onChange: handleChange
  }), /*#__PURE__*/React.createElement(RadioGroup, {
    label: "\u79FB\u4F4D\u60C5\u5F62",
    name: "transferring",
    options: options.transferring,
    value: data.transferring,
    onChange: handleChange
  }), /*#__PURE__*/React.createElement(CheckboxGroup, {
    label: "\u884C\u8D70\u60C5\u5F62",
    name: "walking",
    options: options.walking,
    values: data.walking,
    onChange: handleArrayChange
  }), /*#__PURE__*/React.createElement(RadioGroup, {
    label: "\u4E0A\u4E0B\u6A13\u68AF",
    name: "stairs",
    options: options.stairs,
    value: data.stairs,
    onChange: handleChange
  })), /*#__PURE__*/React.createElement(SectionCard, {
    title: "4. \u5C45\u4F4F\u3001\u671F\u5F85\u8207\u7167\u9867\u8A08\u756B"
  }, /*#__PURE__*/React.createElement(RadioGroup, {
    label: "\u4F4F\u6240\u985E\u578B",
    name: "housingType",
    options: options.housingType,
    value: data.housingType,
    onChange: handleChange
  }), /*#__PURE__*/React.createElement(RadioGroup, {
    label: "\u5C45\u4F4F\u74B0\u5883",
    name: "livingEnvironment",
    options: options.livingEnvironment,
    value: data.livingEnvironment,
    onChange: handleChange
  }), /*#__PURE__*/React.createElement("div", {
    className: "mt-4 border-t pt-4"
  }, /*#__PURE__*/React.createElement(CheckboxGroup, {
    label: "\u671F\u5F85\u4F7F\u7528\u670D\u52D9\u9805\u76EE",
    name: "serviceItems",
    options: options.serviceItems,
    values: data.serviceItems,
    onChange: handleArrayChange
  }), /*#__PURE__*/React.createElement("div", {
    className: "mt-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-sm font-medium text-gray-700 mb-1"
  }, "\u9577\u7167\u9700\u8981\u7B49\u7D1A"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "careLevel",
    value: data.careLevel,
    onChange: handleChange,
    className: "w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500",
    placeholder: "\u4F8B\u5982\uFF1A2"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mt-3"
  }, /*#__PURE__*/React.createElement(RadioGroup, {
    label: "\u5BB6\u7167\u9700\u6C42",
    name: "careNeed",
    options: options.careNeed,
    value: data.careNeed,
    onChange: handleChange
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-4 mt-3"
  }, /*#__PURE__*/React.createElement(RadioGroup, {
    label: "\u6D3E\u6848\u539F\u5247",
    name: "dispatchPrinciple",
    options: options.dispatchPrinciple,
    value: data.dispatchPrinciple,
    onChange: handleChange
  })), /*#__PURE__*/React.createElement("div", {
    className: "mt-3"
  }, /*#__PURE__*/React.createElement(RadioGroup, {
    label: "A\u55AE\u4F4D",
    name: "aUnit",
    options: options.aUnit,
    value: data.aUnit,
    onChange: handleChange
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "w-1/2 print:w-full print:block"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto print:static print:max-h-none print:overflow-visible print:h-auto"
  }, /*#__PURE__*/React.createElement("div", {
    id: "export-content",
    className: "bg-white shadow-lg border border-gray-300 print:shadow-none print:border-none print-container min-h-[1050px] print:min-h-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-right mb-4"
  }, formatDate(data.visitDate), " (", f(data.visitType, "訪視類別"), ")"), /*#__PURE__*/React.createElement("h3", null, "\u3010\u500B\u6848\u8F49\u5165\u4F86\u6E90\u3011"), /*#__PURE__*/React.createElement("p", null, "\u672C\u6848\u7531 ", f(data.referrer, "轉介人員"), " \u63D0\u51FA\u9577\u7167\u670D\u52D9\u7533\u8ACB\uFF0C\u672C\u6B21\u8207 ", f(data.participants, "訪視參與人員"), " \u5171\u540C\u8A55\u4F30\u53CA\u8A0E\u8AD6\u7167\u9867\u670D\u52D9\u3002"), /*#__PURE__*/React.createElement("h3", null, "\u3010\u500B\u6848\u72C0\u6CC1\u6458\u8981\u3011"), /*#__PURE__*/React.createElement("p", null, "1. \u500B\u6848\u70BA ", f(data.age, "年齡"), " \u6B72 ", f(data.gender, "性別"), " \u6027\u3001\u8EAB\u5206\u798F\u5229\u5225\uFF1A", f(data.welfare, "福利身分類別"), "\u3001", f(data.disability, "有無身障證明"), "\u3001", f(data.foreignCare, "外籍看護聘僱"), "\u3002\u500B\u6848", f(data.marriage, "婚姻"), "\uFF0C", f(data.children, "生育情況"), "\uFF0C\u73FE\u8207 ", f(data.livingWith, "同住家人"), "\uFF0C\u4E26\u7531 ", f(data.mainCaregiver, "主要照顧者"), " \u4E3B\u8CAC\u7167\u9867\u3002"), data.memo1 && /*#__PURE__*/React.createElement("p", {
    className: "ml-6 whitespace-pre-wrap"
  }, "\u203B\u8996\u60C5\u6CC1\u5099\u8A3B\uFF1A", data.memo1), /*#__PURE__*/React.createElement("p", null, "2. \u500B\u6848\u60A3\u6709 ", f(data.diseases.length > 0 ? data.diseases.join("、") + (data.diseasesOther ? " (" + data.diseasesOther + ")" : "") : "", "疾病項目"), "\uFF0C\u73FE\u7A69\u5B9A\u7531 ", f(data.escort, "就醫陪同人員"), " \u81F3 ", f(data.hospital, "就診醫療單位"), "\u3002"), data.pastDiseases && /*#__PURE__*/React.createElement("p", {
    className: "ml-6 whitespace-pre-wrap"
  }, "\u203B\u8996\u60C5\u6CC1\u5099\u8A3B\uFF1A\u500B\u6848\u53E6\u6709 ", f(data.pastDiseases), "\u3002"), /*#__PURE__*/React.createElement("p", null, "3. \u8A2A\u8996\u6642\uFF0C\u500B\u6848 ", f(data.consciousness, "意識情形"), "\uFF0C", f(data.communication, "溝通能力"), "\u3002\u500B\u6848\u56E0 ", f(data.disabilityReason, "失能原因"), " \u81F4\u65E5\u5E38\u6D3B\u52D5 ", f(data.actionStatus, "執行情形"), "\u3002\u73FE ", f(data.actionItems, "日常活動項目"), "\uFF0C\u9808\u7531\u4ED6\u4EBA\u5354\u52A9\u4E0B\u57F7\u884C\u3002\u500B\u6848 ", f(data.toileting, "如廁能力"), "\u3002\u8A2A\u8996\u898B\uFF0C\u500B\u6848 ", f(data.transferring, "移位情形"), "\u3001\u500B\u6848 ", f(data.walking, "行走情形"), "\uFF0C\u53E6 ", f(data.stairs, "上下樓梯情形"), "\u3002"), /*#__PURE__*/React.createElement("div", {
    className: "mt-2"
  }, /*#__PURE__*/React.createElement("p", null, "\u203B\u8996\u60C5\u6CC1\u5099\u8A3B\uFF1A"), /*#__PURE__*/React.createElement("p", {
    className: "ml-6 mb-1"
  }, "(1) \u500B\u6848\u53E6\u6709(\u7279\u6B8A\u7167\u9867\u60C5\u5F62-\u7BA1\u704C/\u50B7\u53E3/\u75BC\u75DB\u3001\u4F7F\u7528\u6C27\u6C23/\u8840\u6C27\u76E3\u6E2C/\u65BD\u6253\u80F0\u5CF6\u7D20)\u7B49\u7279\u6B8A\u7167\u8B77\u3002"), /*#__PURE__*/React.createElement("p", {
    className: "ml-6 mb-1"
  }, "(2) \u53C8\u6848\u5BB6\u4EBA\u53E6\u8868\u793A\u500B\u6848\u5177\u6709(\u904A\u8D70/\u4F5C\u606F\u6DF7\u4E82/\u8A00\u8A9E\u653B\u64CA/\u5E72\u64FE\u884C\u70BA/\u6297\u62D2\u7167\u9867/\u5E7B\u60F3/\u5984\u60F3/\u91CD\u8907\u884C\u70BA/\u7126\u616E/\u6182\u9B31/\u653B\u64CA)\u7B49\u60C5\u7DD2\u884C\u70BA\u554F\u984C\u3002"), /*#__PURE__*/React.createElement("p", {
    className: "ml-6 mb-1"
  }, "(3) \u6848\u5BB6\u4F4F\u6240\u70BA ", f(data.housingType, "住所類型"), "\uFF0C\u6574\u9AD4 ", f(data.livingEnvironment, "居住環境"), "\u3002")), /*#__PURE__*/React.createElement("h3", null, "\u3010\u500B\u6848\u8207\u5BB6\u5C6C\u671F\u5F85\u3011"), /*#__PURE__*/React.createElement("p", null, "\u6848\u5BB6\u671F\u5F85\u4F7F\u7528 ", f(data.serviceItems, "服務項目"), " \u7167\u9867\u3001\u4EA4\u901A\u63A5\u9001\u53CA\u5598\u606F\u670D\u52D9\u3002"), /*#__PURE__*/React.createElement("h3", null, "\u3010\u7167\u9867\u8A08\u756B\u8AAA\u660E\u3011"), /*#__PURE__*/React.createElement("p", null, "\u672C\u6B21\u8A08\u756B\u65BC ", formatDate(data.visitDate), " (", f(data.visitType, "訪視類別"), ") \u9577\u7167\u9700\u8981\u7B49\u7D1A\u70BA\u7B2C ", f(data.careLevel, "O"), " \u7D1A\uFF0C\u8A55\u4F30\u7167\u9867\u554F\u984C\uFF0C\u8A73\u898B\u7CFB\u7D71\u554F\u984C\u6E05\u55AE\uFF0C\u7167\u5C08\u8207 ", f(data.participants, "訪視參與人員"), " \u8A0E\u8AD6\u7167\u9867\u9700\u6C42\u5982\u4E0B:"), /*#__PURE__*/React.createElement("div", {
    className: "ml-6 mt-2 space-y-1"
  }, /*#__PURE__*/React.createElement("p", null, "1.\u7167\u9867\u53CA\u5C08\u696D\u984D\u5EA6\uFF1A10,020\u5143/\u6708\u3002(\u5099\u8A3B:\u672C\u6B21\u8A08\u756B\u4E0D\u8DB3\u6708\uFF0C\u6838\u5B9A\u984D\u5EA6\u4F9D\u7CFB\u7D71\u8A08\u6838)"), /*#__PURE__*/React.createElement("p", {
    className: "ml-4"
  }, "\u5C45\u5BB6\u670D\u52D9\uFF1A\u5177\u4F7F\u7528\u9700\u6C42\uFF0C\u9805\u76EE:\u966A\u540C\u5C31\u91AB\u3002"), /*#__PURE__*/React.createElement("p", {
    className: "ml-4"
  }, "\u5C08\u696D\u670D\u52D9: \u7121\u4F7F\u7528\u9700\u6C42\u3002"), /*#__PURE__*/React.createElement("p", null, "2.\u4EA4\u901A\u63A5\u9001\uFF1A1680\u5143/\u6708\uFF0C\u5177\u4F7F\u7528\u9700\u6C42\u3002(\u5099\u8A3B:\u672C\u6B21\u8A08\u756B\u4E0D\u8DB3\u6708\uFF0C\u6838\u5B9A\u984D\u5EA6\u4F9D\u7CFB\u7D71\u8A08\u6838)"), /*#__PURE__*/React.createElement("p", null, "3.\u8F14\u5177\u670D\u52D9\u53CA\u5C45\u5BB6\u7121\u969C\u7919\u74B0\u5883\u6539\u5584\u670D\u52D9\uFF1A40000\u5143/3\u5E74\u3002\u7121\u4F7F\u7528\u9700\u6C42\u3002"), /*#__PURE__*/React.createElement("p", null, "4.\u5598\u606F\u670D\u52D9 :\u7D66\u4ED8\u984D\u5EA632,340/\u5E74\uFF0C\u5177\u4F7F\u7528\u9700\u8981\uFF0C\u9700\u8981\u6642\u53E6\u63D0\u51FA\u7533\u8ACB\u3002"), /*#__PURE__*/React.createElement("p", null, "5.\u8F49\u4ECB\u5176\u4ED6\u8CC7\u6E90\uFF1A\u3002"), /*#__PURE__*/React.createElement("p", null, "A. ", f(data.careNeed, "(家照需求)")), /*#__PURE__*/React.createElement("p", null, "B. \u4F9D\u64DA\u885B\u90E8\u9867\u5B57\u7B2C110960777\u865F\u51FD\u4E4B\u8AAA\u660E\uFF0C\u672C\u6848(AA08\u300109\u6838\u5B9A)")), /*#__PURE__*/React.createElement("p", {
    className: "mt-2"
  }, "\u672C\u6848\u4F9D ", f(data.dispatchPrinciple, "(派案原則)"), " \u6D3E\u6848 ", f(data.aUnit, "(A單位)"), " \u70BAA\u55AE\u4F4D\u500B\u7BA1\uFF0C\u8ACBA\u55AE\u4F4D\u65BC\u7763\u5C0E\u7C3D\u5BE92\u5929\u5167\u5B8C\u6210\u500B\u6848\u554F\u984C\u3001\u78BA\u7ACB\u7167\u9867\u76EE\u6A19\uFF0C\u64EC\u5B9A\u9069\u5207\u7167\u9867\u7D44\u5408\u4E26\u65BC\u8A08\u756B\u7C21\u8FF0\u4E2D\u5B8C\u6574\u5448\u73FE\u7167\u9867\u8A08\u756B\u9001\u5BE9\uFF0C\u6838\u5099\u5F8C\u7167\u6703B\u55AE\u4F4D\u63D0\u4F9B\u670D\u52D9\uFF0C\u5018\u6709\u5C08\u696D\u9700\u6C42\u3001\u8F14\u5177\u6216\u7121\u969C\u7919\u6539\u5584\u9700\u6C42\u8005\uFF0C\u9015\u4F9D\u670D\u52D9\u898F\u5B9A\u5099\u59A5\u6587\u4EF6\uFF0C\u6B63\u78BA\u9032\u884C\u7CFB\u7D71\u7167\u6703\u64CD\u4F5C\u3002"))))), /*#__PURE__*/React.createElement(SettingsModal, {
    isOpen: showSettings,
    onClose: () => setShowSettings(false),
    options: options,
    setOptions: setOptions,
    onExport: handleExportSettings,
    onImport: handleImportSettings
  }));
};
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(/*#__PURE__*/React.createElement(App, null));
