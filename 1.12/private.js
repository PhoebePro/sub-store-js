const { type, name } = $arguments
const compatible_outbound = {
  tag: 'COMPATIBLE',
  type: 'direct',
}

let compatible
let config = JSON.parse($files[0])
let proxies = await produceArtifact({
  name,
  type: /^1$|col/i.test(type) ? 'collection' : 'subscription',
  platform: 'sing-box',
  produceType: 'internal',
})

config.outbounds.push(...proxies)

config.outbounds.map(i => {
  if (['► Select'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies))
  }
  if (['🇭🇰 HK'].includes(i.tag)) {      
    i.outbounds.push(...getTags(proxies, /^(?=.*(?:香港|hk|hongkong|kong kong|Hong Kong))(?!.*(SNTP|0\.2)).*/i))
  }
  if (['🇯🇵 JP'].includes(i.tag)) {       
    i.outbounds.push(...getTags(proxies, /^(?=.*(?:日本|jp|japan|Japan))(?!.*(SNTP|0\.2)).*/i))
  }
  if (['🇸🇬 SG'].includes(i.tag)) {      
    i.outbounds.push(...getTags(proxies, /^(?=.*(?:新加坡|sg|singapore|Singapore))(?!.*(SNTP|0\.2)).*/i))
  }
  if (['🇺🇸 US'].includes(i.tag)) {       
    i.outbounds.push(...getTags(proxies, /^(?=.*(?:美国|us|united states|United States))(?!.*(SNTP|0\.2)).*/i))
  }
  if (['emby'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /US|JP|United States|Japan|日本/i))
  }
})

config.outbounds.forEach(outbound => {
  if (Array.isArray(outbound.outbounds) && outbound.outbounds.length === 0) {
    if (!compatible) {
      config.outbounds.push(compatible_outbound)
      compatible = true
    }
    outbound.outbounds.push(compatible_outbound.tag);
  }
});

$content = JSON.stringify(config, null, 2)

function getTags(proxies, regex) {
  return (regex ? proxies.filter(p => regex.test(p.tag)) : proxies).map(p => p.tag)
}
