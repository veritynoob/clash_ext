/**
 * Gemini 分流覆写脚本
 *
 * 用法：在 Mihomo Party / Clash Verge Rev 的覆写/扩展脚本中加载此文件
 */

// ============== MAIN ==============

/**
 * @param {Object} config - Clash 配置
 * @returns {Object} - 修改后的配置
 */
function main(config) {
  // 筛选名称包含"新加坡"的节点
  const singaporeProxies = (config.proxies || []).filter(p =>
    p.name.includes('新加坡')
  );

  // 添加 Gemini 规则提供者
  const geminiRuleProvider = {
    type: 'http',
    behavior: 'classical',
    url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Gemini/Gemini.yaml',
    interval: 86400,
    tolerance: 50
  };

  // 添加新加坡策略组
  const singaporeGroup = {
    type: 'select',
    name: 'Singapore',
    proxies: singaporeProxies.map(p => p.name)
  };

  // 添加 Gemini 分流规则
  const geminiRule = 'RULE-SET,gemini,Singapore';

  // 写入配置
  config['rule-providers'] = config['rule-providers'] || {};
  config['rule-providers'].gemini = geminiRuleProvider;

  config['proxy-groups'] = config['proxy-groups'] || [];
  config['proxy-groups'].push(singaporeGroup);

  config['rules'] = config['rules'] || [];
  config['rules'].unshift(geminiRule);

  return config;
}
