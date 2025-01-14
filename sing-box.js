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
  if (['👉 Select'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies))
  }
  if (['🇭🇰 HK'].includes(i.tag)) {      
    i.outbounds.push(...getTags(proxies, /香港|hk|hongkong|kong kong|Hong Kong/i))
  }
  if (['🇨🇳 TW'].includes(i.tag)) {   
    i.outbounds.push(...getTags(proxies, /台湾|tw|taiwan|Taiwan/i))
  }
  if (['🇯🇵 JP'].includes(i.tag)) {  
    i.outbounds.push(...getTags(proxies, /日本|jp|japan|Japan/i))
  }
  if (['🇸🇬 SG'].includes(i.tag)) { 
    i.outbounds.push(...getTags(proxies, /新加坡|sg|singapore|Singapore/i))
  }
  if (['🇺🇸 US'].includes(i.tag)) {       
    i.outbounds.push(...getTags(proxies, /^(?=.*(美国|us|united states|United States))(?!.*(Austria|Russia)).*$/i))
  }
  if (['Emby'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /TKV/))
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
