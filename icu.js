/**
 * ICU 分流覆写脚本
 *
 * 用法：在 Mihomo Party / Clash Verge Rev 的覆写/扩展脚本中加载此文件
 */

// ============== MAIN ==============

/**
 * @param {Object} config - Clash 配置
 * @returns {Object} - 修改后的配置
 */
function main(config) {
  // 筛选名称包含"icu"的节点
  const openRouterProxies = (config.proxies || []).filter(p =>
    p.name.toLowerCase().includes('icu')
  );

  // 添加 Gemini 规则提供者
  const geminiRuleProvider = {
    type: 'http',
    behavior: 'classical',
    url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Gemini/Gemini.yaml',
    interval: 86400,
  };

  // 添加广告/跟踪域名屏蔽规则提供者
  const rejectProvider = {
    type: 'http',
    behavior: 'domain',
    url: 'https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/reject.txt',
    interval: 86400,
  };

  // 添加 OpenRouter 策略组
  const openRouterGroup = {
    type: 'url-test',
    name: 'OpenRouter',
    proxies: openRouterProxies.map(p => p.name),
    interval: 600,
    tolerance: 50
  };

  // 添加分流规则
  const rejectRule = 'RULE-SET,reject,REJECT';
  const geminiRule = 'RULE-SET,gemini,OpenRouter';
  const openRouterRule = 'DOMAIN-KEYWORD,openrouter.ai,OpenRouter';

  // 写入配置
  config['rule-providers'] = config['rule-providers'] || {};
  config['rule-providers'].reject = rejectProvider;
  config['rule-providers'].gemini = geminiRuleProvider;

  config['proxy-groups'] = config['proxy-groups'] || [];
  config['proxy-groups'].push(openRouterGroup);

  config['rules'] = config['rules'] || [];
  config['rules'].unshift(geminiRule);
  config['rules'].unshift(openRouterRule);
  config['rules'].unshift(rejectRule); // REJECT 优先级最高

  // 过滤所有代理组中包含"日本"的节点
  (config['proxy-groups'] || []).forEach(group => {
    if (group.proxies && Array.isArray(group.proxies)) {
      group.proxies = group.proxies.filter(p => !p.includes('日本'));
    }
  });

  return config;
}
