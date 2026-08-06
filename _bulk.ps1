$template = Get-Content 'c:\Users\admin\Desktop\lawtools\jietiao\index.html' -Raw -Encoding UTF8

# Define all 9 remaining document pages
$pages = @(
  @{
    dir='laodongzhongcai'; docId='labor';
    title='劳动仲裁申请书在线生成_仲裁申请书模板_免费填写-法包';
    desc='在线生成规范劳动仲裁申请书，填写申请人、被申请人、仲裁请求、事实理由等信息，自动生成符合格式的仲裁申请书。';
    h1='劳动仲裁申请书在线生成 - 填写信息自动出规范仲裁申请书';
    breadcrumb='劳动仲裁';
    faq=@'
<details class="faq-item"><summary>什么是劳动仲裁？</summary><div class="faq-body">劳动仲裁是解决劳动争议的法定前置程序。根据《劳动争议调解仲裁法》，劳动者与用人单位发生劳动争议，必须先经过仲裁程序，对仲裁结果不服的才能向法院起诉。</div></details>

<details class="faq-item"><summary>劳动仲裁申请书的核心部分</summary><div class="faq-body">
<h4>仲裁请求</h4><p>写明具体、明确的请求。如"请求裁决被申请人支付拖欠工资×元""请求裁决被申请人支付违法解除劳动合同赔偿金×元"。不要写笼统的"要求公司赔偿"。</p>
<h4>事实和理由</h4><p>简洁陈述经过：何时入职、从事什么工作、发生了什么事、对方违反了什么规定。控制在500字以内。</p>
<h4>证据清单</h4><p>列明证据名称和证明目的。如"劳动合同一份，证明劳动关系""工资银行流水，证明拖欠工资金额"。</p>
</div></details>

<details class="faq-item"><summary>劳动仲裁完整流程</summary><div class="faq-body">
<p>提交申请书 → 仲裁委5日内决定是否受理 → 受理后45-60日内开庭审理 → 作出裁决 → 不服可在15日内向法院起诉。</p>
</div></details>

<details class="faq-item"><summary>关于劳动仲裁的常见问题</summary><div class="faq-body">
<h4>劳动仲裁要收费吗？</h4><p>不收费。劳动争议仲裁不收取费用。</p>
<h4>劳动仲裁的时效是多久？</h4><p>1年，从当事人知道或应当知道权利被侵害之日起算。拖欠工资的时效特殊，劳动关系存续期间不受1年限制。</p>
<h4>没有劳动合同能申请劳动仲裁吗？</h4><p>可以。用工资流水、社保记录、工作证、考勤记录等证明事实劳动关系。</p>
<h4>劳动仲裁输了还能去法院吗？</h4><p>可以。收到裁决书15日内向法院起诉。</p>
<h4>公司被注销了还能申请劳动仲裁吗？</h4><p>可以列公司的股东或清算组为被申请人。</p>
<h4>劳动仲裁申请书自己写还是请律师？</h4><p>金额不大、案情简单的可以自己写。涉及金额较大或案情复杂的建议咨询律师。</p>
</div></details>
'@; schemaQs=@('劳动仲裁要收费吗？','劳动仲裁的时效是多久？','没有劳动合同能申请劳动仲裁吗？','劳动仲裁输了还能去法院吗？','公司被注销了还能申请劳动仲裁吗？','劳动仲裁申请书自己写还是请律师？');
    schemaAs=@('不收费。劳动争议仲裁不收取费用。','1年，从当事人知道或应当知道权利被侵害之日起算。','可以。用工资流水、社保记录、工作证等证明事实劳动关系。','可以。收到裁决书15日内向法院起诉。','可以列公司的股东或清算组为被申请人。','金额不大的可以自己写。金额较大或案情复杂的建议咨询律师。');
    links=@(@('href="/laodonghetong/"','劳动合同'),@('href="/minshiqisuzhuang/"','民事起诉状'),@('href="/zufanghetong/"','租赁合同'))
  },
  @{
    dir='minshiqisuzhuang'; docId='complaint';
    title='民事起诉状在线生成_起诉状模板_免费填写-法包';
    desc='在线生成规范民事起诉状，填写原被告信息、诉讼请求、事实与理由等，自动生成符合法院立案要求的起诉状文书。';
    h1='民事起诉状在线生成 - 填写信息自动出规范起诉状';
    breadcrumb='民事起诉状';
    faq=@'
<details class="faq-item"><summary>什么是民事起诉状？</summary><div class="faq-body">民事起诉状是原告向法院提交的启动民事诉讼程序的法律文书。根据《民事诉讼法》第一百二十二条，起诉必须符合法定条件，起诉状应当载明当事人信息、诉讼请求、事实与理由、证据等。</div></details>

<details class="faq-item"><summary>民事起诉状的核心部分</summary><div class="faq-body">
<h4>当事人信息</h4><p>原告和被告的姓名、身份证号、住址、联系方式。被告信息不全的，法院可能不予受理。</p>
<h4>诉讼请求</h4><p>明确具体。如"判令被告偿还借款本金5万元及利息"。不要写笼统请求。</p>
<h4>事实与理由</h4><p>简洁陈述纠纷经过，说明被告违反了什么法律。控制在500字以内。</p>
<h4>证据清单</h4><p>列明证据名称、来源和证明目的。如"借条原件一份，证明借款事实"。</p>
</div></details>

<details class="faq-item"><summary>去哪个法院起诉？</summary><div class="faq-body">
<p>一般原则是被告住所地法院。合同纠纷可以由合同履行地法院管辖。民间借贷中，出借人所在地可以作为合同履行地。</p>
</div></details>

<details class="faq-item"><summary>关于民事起诉的常见问题</summary><div class="faq-body">
<h4>不请律师可以自己去法院起诉吗？</h4><p>可以。民事案件当事人有权自行诉讼，不强制请律师。</p>
<h4>起诉后多久能开庭？</h4><p>简易程序一般立案后1-2个月内开庭，普通程序2-3个月。</p>
<h4>被告地址不知道怎么办？</h4><p>可以委托律师查询，或申请法院协查。</p>
<h4>诉讼时效过了还能起诉吗？</h4><p>可以起诉，但如果被告提出时效抗辩，法院会驳回诉讼请求。</p>
<h4>起诉状交到法院后流程是什么？</h4><p>立案审查→缴纳诉讼费→排期开庭→开庭审理→判决→执行。</p>
<h4>证据不足能起诉吗？</h4><p>可以起诉，但有败诉风险。建议起诉前尽可能收集充分证据。</p>
</div></details>
'@; schemaQs=@('不请律师可以自己去法院起诉吗？','起诉后多久能开庭？','被告地址不知道怎么办？','诉讼时效过了还能起诉吗？','起诉状交到法院后流程是什么？','证据不足能起诉吗？');
    schemaAs=@('可以。民事案件当事人有权自行诉讼。','简易程序1-2个月，普通程序2-3个月。','可以委托律师查询或申请法院协查。','可以起诉，但被告提出时效抗辩的法院会驳回。','立案审查→缴费→排期→开庭→判决→执行。','可以起诉，但有败诉风险。建议充分收集证据。');
    links=@(@('href="/qiantiao/"','欠条'),@('href="/jietiao/"','借条'),@('href="/hezuoxieyi/"','合作协议'))
  },
  @{
    dir='laodonghetong'; docId='employment';
    title='劳动合同在线生成_劳动合同模板_免费填写-法包';
    desc='在线生成规范劳动合同，填写用人单位、劳动者、岗位、薪资、期限等信息，自动生成符合劳动法的劳动合同文书。';
    h1='劳动合同在线生成 - 填写信息自动出规范劳动合同';
    breadcrumb='劳动合同';
    faq=@'
<details class="faq-item"><summary>什么是劳动合同？</summary><div class="faq-body">劳动合同是劳动者与用人单位确立劳动关系、明确双方权利义务的协议。根据《劳动合同法》第十条，建立劳动关系应当订立书面劳动合同。已建立劳动关系未同时订立书面合同的，应自用工之日起一个月内订立。</div></details>

<details class="faq-item"><summary>劳动合同必须包含的条款</summary><div class="faq-body">
<h4>《劳动合同法》第十七条规定的必备条款</h4><p>合同期限、工作内容和工作地点、工作时间和休息休假、劳动报酬、社会保险、劳动保护及职业危害防护等。</p>
</div></details>

<details class="faq-item"><summary>公司不签劳动合同的后果</summary><div class="faq-body">
<p>根据《劳动合同法》第八十二条，用人单位自用工之日起超过一个月不满一年未订立书面劳动合同的，应向劳动者每月支付二倍工资。</p>
</div></details>

<details class="faq-item"><summary>关于劳动合同的常见问题</summary><div class="faq-body">
<h4>试用期最长不能超过多久？</h4><p>最长6个月，仅适用于3年以上或无固定期限合同。</p>
<h4>公司不签劳动合同怎么办？</h4><p>保留工资记录、工牌等证据，可申请劳动仲裁要求双倍工资。</p>
<h4>劳动合同可以约定违约金吗？</h4><p>仅在培训服务期和竞业限制两种情况下可以。</p>
<h4>竞业限制协议可以不签吗？</h4><p>可以。竞业限制是双方自愿约定的。</p>
<h4>试用期被辞退有赔偿吗？</h4><p>试用期辞退需证明不符合录用条件，违法辞退可要求赔偿金。</p>
<h4>劳动合同到期不续签有补偿吗？</h4><p>公司提出不续签或降低条件续签被拒的，应支付经济补偿金。</p>
</div></details>
'@; schemaQs=@('试用期最长不能超过多久？','公司不签劳动合同怎么办？','劳动合同可以约定违约金吗？','竞业限制协议可以不签吗？','试用期被辞退有赔偿吗？','劳动合同到期不续签有补偿吗？');
    schemaAs=@('最长6个月，仅适用于3年以上或无固定期限合同。','保留工资记录等证据，可申请劳动仲裁要求双倍工资。','仅在培训服务期和竞业限制两种情况下可以。','可以。竞业限制是双方自愿约定的。','需证明不符合录用条件，违法辞退可要求赔偿金。','公司提出不续签的，应支付经济补偿金。');
    links=@(@('href="/laodongzhongcai/"','劳动仲裁'),@('href="/zhuanranghetong/"','转让合同'),@('href="/minshiqisuzhuang/"','民事起诉状'))
  },
  @{
    dir='zhuanranghetong'; docId='transfer';
    title='转让合同在线生成_转让合同模板_免费填写-法包';
    desc='在线生成规范转让合同，填写转让方、受让方、转让标的、转让费用等信息，自动生成完备的转让合同文书。';
    h1='转让合同在线生成 - 填写信息自动出规范转让合同';
    breadcrumb='转让合同';
    faq=@'
<details class="faq-item"><summary>转让合同是什么？</summary><div class="faq-body">转让合同是转让方将财产或权利转让给受让方，受让方支付价款的协议。根据《民法典》，转让合同应当明确约定转让标的、价款、支付方式、违约责任等条款，以保障双方合法权益。</div></details>

<details class="faq-item"><summary>转让合同的关键条款</summary><div class="faq-body">
<h4>转让标的</h4><p>明确具体，写清楚转让的是什么。如"位于XX市XX路XX号的店铺""XX公司10%的股权"。</p>
<h4>转让费用及支付方式</h4><p>写明转让费总额、支付方式（一次性/分期）、支付时间。涉及定金的，约定退还和没收条件。</p>
<h4>债务承担</h4><p>转让前的债务由谁承担必须写清楚。这是最容易出纠纷的地方。</p>
<h4>违约责任</h4><p>约定违约金标准，如"一方违约的，支付转让费20%的违约金"。</p>
</div></details>

<details class="faq-item"><summary>店铺转让的注意事项</summary><div class="faq-body">
<p style="color:#DC2626;margin:0 0 8px;">供应商欠款未结清——接手后被追债。签约前要求原店主结清欠款。</p>
<p style="color:#DC2626;margin:0 0 8px;">房东不同意转租——未经同意转租无效。签约前须取得房东书面同意。</p>
<p style="color:#16A34A;margin:0;">设备清单写清楚——避免接手后发现设备不能用。</p>
</div></details>

<details class="faq-item"><summary>关于转让合同的常见问题</summary><div class="faq-body">
<h4>店铺转让需要房东同意吗？</h4><p>需要。未经房东书面同意转租的，可解除租赁合同。</p>
<h4>股权转让需要工商登记吗？</h4><p>需要。股权转让后应办理工商变更登记。</p>
<h4>转让前的债务由谁承担？</h4><p>以合同约定为准。未约定的，一般由原经营者承担。</p>
<h4>转让合同不公证有效吗？</h4><p>不公证也有效。公证不是合同生效的必要条件。</p>
<h4>转让后不配合过户怎么办？</h4><p>可以起诉要求对方履行过户义务并追究违约责任。</p>
<h4>店铺转让费包括什么？</h4><p>通常包括经营权、设备设施、装修、客户资源等。</p>
</div></details>
'@; schemaQs=@('店铺转让需要房东同意吗？','股权转让需要工商登记吗？','转让前的债务由谁承担？','转让合同不公证有效吗？','转让后不配合过户怎么办？','店铺转让费包括什么？');
    schemaAs=@('需要。未经房东书面同意的转租无效。','需要。应办理工商变更登记。','以合同约定为准。未约定的由原经营者承担。','不公证也有效。公证不是合同生效的必要条件。','可起诉要求履行过户义务并追究违约责任。','通常包括经营权、设备设施、装修、客户资源等。');
    links=@(@('href="/zufanghetong/"','租赁合同'),@('href="/hezuoxieyi/"','合作协议'),@('href="/qiantiao/"','欠条'))
  },
  @{
    dir='qubaohoushen'; docId='bail';
    title='取保候审申请书在线生成_取保候审申请书模板_免费填写-法包';
    desc='在线生成规范取保候审申请书，填写申请人、犯罪嫌疑人信息、申请理由等，自动生成符合格式的取保候审申请书。';
    h1='取保候审申请书在线生成 - 填写信息自动出规范申请书';
    breadcrumb='取保候审';
    faq=@'
<details class="faq-item"><summary>什么是取保候审？</summary><div class="faq-body">取保候审是刑事诉讼中的一种强制措施变更。根据《刑事诉讼法》第六十七条，人民法院、人民检察院和公安机关对符合条件的犯罪嫌疑人、被告人，可以责令其提出保证人或交纳保证金，不予羁押。</div></details>

<details class="faq-item"><summary>取保候审的适用条件</summary><div class="faq-body">
<p>可能判处管制、拘役或独立适用附加刑的；可能判处有期徒刑以上刑罚但不致发生社会危险性的；患有严重疾病、生活不能自理的；怀孕或正在哺乳自己婴儿的妇女；羁押期限届满案件尚未办结的。</p>
</div></details>

<details class="faq-item"><summary>申请书怎么写</summary><div class="faq-body">
<h4>申请人信息</h4><p>写明与犯罪嫌疑人的关系，如"系犯罪嫌疑人XX之父"。</p>
<h4>申请理由</h4><p>对照取保候审条件，说明为什么符合。如"患有严重疾病""无社会危险性"等。</p>
<h4>保证方式</h4><p>选择人保（提供保证人）或财保（交纳保证金）。</p>
</div></details>

<details class="faq-item"><summary>关于取保候审的常见问题</summary><div class="faq-body">
<h4>取保候审申请书家属能自己写吗？</h4><p>可以。家属可自行书写并提交，不强制请律师。</p>
<h4>取保候审要交多少钱？</h4><p>保证金起点为1000元，具体由办案机关确定。</p>
<h4>取保候审后还会被判刑吗？</h4><p>取保候审只是变更强制措施，不影响后续审判。</p>
<h4>取保候审的期限是多久？</h4><p>最长12个月。期间不得中断案件侦查、起诉和审理。</p>
<h4>被拒绝了怎么办？</h4><p>可补充材料后再次申请，也可委托律师。法律没有限制申请次数。</p>
<h4>取保候审期间要遵守什么？</h4><p>未经批准不得离开所居住的市、县；住址变动24小时内报告；随传随到；不得干扰证人。</p>
</div></details>
'@; schemaQs=@('取保候审申请书家属能自己写吗？','取保候审要交多少钱？','取保候审后还会被判刑吗？','取保候审的期限是多久？','被拒绝了怎么办？','取保候审期间要遵守什么？');
    schemaAs=@('可以。家属可自行书写并提交。','保证金起点为1000元，具体由办案机关确定。','取保候审只是变更强制措施，不影响后续审判。','最长12个月。','可补充材料再次申请，也可委托律师。','不得离开所居住的市、县；随传随到；不得干扰证人。');
    links=@(@('href="/minshiqisuzhuang/"','民事起诉状'),@('href="/laodongzhongcai/"','劳动仲裁'),@('href="/jietiao/"','借条'))
  },
  @{
    dir='qiantiao'; docId='debt';
    title='欠条在线生成_规范欠条格式模板_免费填写-法包';
    desc='在线生成规范欠条，填写欠款人、金额、还款日期等信息，自动生成法律效力完备的欠条文书。适用于货款、工程款、服务费等欠款场景。';
    h1='欠条在线生成 - 填写信息自动出规范欠条';
    breadcrumb='欠条';
    faq=@'
<details class="faq-item"><summary>欠条和借条的区别</summary><div class="faq-body">
<p>借条适用于借贷关系，诉讼时效从还款日次日起算3年；欠条适用于货款、工程款等多种欠款场景，诉讼时效从出具之日起算3年。借条直接证明借贷关系，欠条需额外证明欠款原因。</p>
</div></details>

<details class="faq-item"><summary>规范欠条必须包含的要素</summary><div class="faq-body">
<h4>1. 欠款人身份信息</h4><p>姓名+身份证号，确保身份唯一。</p>
<h4>2. 欠款原因</h4><p>写明货款/工程款/服务费等，避免争议。</p>
<h4>3. 欠款金额大小写</h4><p>大小写同时写明，防篡改。</p>
<h4>4. 还款日期</h4><p>约定还款日期有利于诉讼时效计算。</p>
<h4>5. 签字+按手印+日期</h4><p>欠款人必须亲笔签字按手印。</p>
</div></details>

<details class="faq-item"><summary>欠条的诉讼时效</summary><div class="faq-body">
<p>从欠条出具之日起算3年。与借条不同——借条从约定还款日期次日起算，欠条从出具之日起算。期间催过款的，从最后一次催款日起重新计算3年。</p>
</div></details>

<details class="faq-item"><summary>关于欠条的常见问题</summary><div class="faq-body">
<h4>欠条和借条哪个法律效力强？</h4><p>法律效力相同，但借条举证更直接。欠条需额外证明欠款原因。</p>
<h4>欠条不写还款日期有效吗？</h4><p>有效。债权人可随时要求还款但应给予合理期限。</p>
<h4>欠条过了3年还能起诉吗？</h4><p>可起诉但欠款人提时效抗辩的会驳回。期间催过款的重新计算3年。</p>
<h4>只有欠条没有转账记录能赢吗？</h4><p>视情况。现金交易欠条可单独作为证据。银行转账需补充记录。</p>
<h4>欠条金额大小写不一致怎么办？</h4><p>一般以大写金额为准。建议书写时仔细核对。</p>
<h4>欠条被撕毁了还有效吗？</h4><p>能拼接还原或有复印件、照片佐证的，仍可作为证据使用。</p>
</div></details>
'@; schemaQs=@('欠条和借条哪个法律效力强？','欠条不写还款日期有效吗？','欠条过了3年还能起诉吗？','只有欠条没有转账记录能赢吗？','欠条金额大小写不一致怎么办？','欠条被撕毁了还有效吗？');
    schemaAs=@('法律效力相同，但借条举证更直接。','有效。债权人可随时要求还款。','可起诉，但欠款人提出时效抗辩的会驳回。','视情况。现金交易欠条可单独作为证据。','一般以大写金额为准。','能拼接还原或有复印件的，仍可作为证据。');
    links=@(@('href="/jietiao/"','借条'),@('href="/minshiqisuzhuang/"','民事起诉状'),@('href="/hezuoxieyi/"','合作协议'))
  },
  @{
    dir='hezuoxieyi'; docId='partner';
    title='合作协议在线生成_合作协议模板_免费填写-法包';
    desc='在线生成规范合作协议，填写合作方、合作内容、出资比例、利润分配等信息，自动生成完备的合作协议文书。';
    h1='合作协议在线生成 - 填写信息自动出规范合作协议';
    breadcrumb='合作协议';
    faq=@'
<details class="faq-item"><summary>合作协议是什么？</summary><div class="faq-body">合作协议是两个以上合伙人就共同出资、共同经营、共享收益、共担风险达成的协议。根据《民法典》第九百六十七条，合伙合同是两个以上合伙人为了共同的事业目的订立的共享利益、共担风险的协议。</div></details>

<details class="faq-item"><summary>合作协议必须写清楚的5件事</summary><div class="faq-body">
<h4>出资方式</h4><p>写明每个合伙人的出资方式（现金、技术、资源、设备等）和金额，以及出资时间。</p>
<h4>利润分配</h4><p>写明分配比例、分配周期（按月/按季/按年）、是否有优先回本安排。</p>
<h4>决策权</h4><p>区分日常事务和重大事项。重大事项（如大额支出、变更经营范围）需要多少合伙人同意。</p>
<h4>退出机制</h4><p>写明退伙的条件、退伙时的结算方式、竞业限制。</p>
<h4>散伙清算</h4><p>约定解散条件、清算程序、剩余财产分配方式。</p>
</div></details>

<details class="faq-item"><summary>和朋友合伙为什么不签协议会翻脸</summary><div class="faq-body">
<p>口头约定没有法律约束力，出了纠纷各说各话。最常见翻脸场景：利润分配说不清、一人退出另一人不肯结算、亏了钱互相推卸责任。书面协议把丑话说在前面，反而能保护友谊。</p>
</div></details>

<details class="faq-item"><summary>关于合作协议的常见问题</summary><div class="faq-body">
<h4>口头合伙协议有效吗？</h4><p>两个以上无利害关系人证明的可以认定有效。但举证困难，强烈建议书面签订。</p>
<h4>合伙人中途想退出怎么办？</h4><p>按协议约定的退出机制执行。没有约定的需其他合伙人同意。</p>
<h4>合伙亏了债务怎么承担？</h4><p>普通合伙人对合伙债务承担无限连带责任。</p>
<h4>合伙协议需要公证吗？</h4><p>不需要公证就有效。涉及金额较大的，公证可增强证据效力。</p>
<h4>合伙人私自把钱转走了怎么办？</h4><p>构成侵占，可要求返还并赔偿损失。情节严重可能涉嫌犯罪。</p>
<h4>合伙协议和公司章程有什么区别？</h4><p>合伙协议约束合伙人关系，公司章程是公司的组织章程。</p>
</div></details>
'@; schemaQs=@('口头合伙协议有效吗？','合伙人中途想退出怎么办？','合伙亏了债务怎么承担？','合伙协议需要公证吗？','合伙人私自把钱转走怎么办？','合伙协议和公司章程有什么区别？');
    schemaAs=@('可认定有效但举证困难，强烈建议书面签订。','按协议约定的退出机制执行。','普通合伙人对合伙债务承担无限连带责任。','不公证也有效。','构成侵占，可要求返还并赔偿损失。','合伙协议约束合伙人关系，公司章程是公司组织章程。');
    links=@(@('href="/zhuanranghetong/"','转让合同'),@('href="/jietiao/"','借条'),@('href="/laodongzhongcai/"','劳动仲裁'))
  },
  @{
    dir='hunqiancaichan'; docId='prenup';
    title='婚前财产协议在线生成_婚前财产协议模板_免费填写-法包';
    desc='在线生成规范婚前财产协议，填写双方信息、财产范围、归属约定等，自动生成法律效力完备的婚前财产协议文书。依据《民法典》第1065条。';
    h1='婚前财产协议在线生成 - 填写信息自动出规范婚前协议';
    breadcrumb='婚前财产协议';
    faq=@'
<details class="faq-item"><summary>婚前财产协议有法律效力吗？</summary><div class="faq-body">有。根据《民法典》第一千零六十五条，男女双方可以约定婚前及婚后财产归各自所有、共同所有或部分各自所有。约定应采用书面形式，对双方具有约束力。</div></details>

<details class="faq-item"><summary>什么情况建议签婚前协议</summary><div class="faq-body">
<p>婚前有房产尤其是有贷款的房产；婚前有公司股权或经营性资产；双方收入差距较大；再婚且一方或双方有前段婚姻的子女；一方或家庭有大额财产希望明确归属。</p>
</div></details>

<details class="faq-item"><summary>婚前协议可以约定什么/不能约定什么</summary><div class="faq-body">
<p style="color:#16A34A;">可约定：婚前财产归属、婚后收入分配方式、债务承担方式。</p>
<p style="color:#DC2626;">不能约定：离婚的条件和程序（法定）、人身权利限制、子女抚养权归属。</p>
</div></details>

<details class="faq-item"><summary>关于婚前协议的常见问题</summary><div class="faq-body">
<h4>婚前协议自己写有效吗？</h4><p>双方签字即有效，不强制公证。但建议使用规范模板。</p>
<h4>婚前协议需要公证吗？</h4><p>不公证也有效。涉及房产等大额财产的，建议公证。</p>
<h4>婚前买的房婚后算共同财产吗？</h4><p>婚前个人购买并登记在个人名下的，属个人财产。婚后共同还贷部分及对应增值属于共同财产。</p>
<h4>能约定离婚时不分财产吗？</h4><p>可约定婚前财产归各自所有，但显失公平的条款可能被认定无效。</p>
<h4>对方不签字怎么办？</h4><p>婚前协议须双方自愿签署。对方不签的，婚前财产仍归各自所有。</p>
<h4>再婚一定要签婚前协议吗？</h4><p>不强制，但强烈建议。再婚双方有各自财产和子女，签协议可避免纠纷。</p>
</div></details>
'@; schemaQs=@('婚前协议自己写有效吗？','婚前协议需要公证吗？','婚前买的房婚后算共同财产吗？','能约定离婚时不分财产吗？','对方不签字怎么办？','再婚一定要签婚前协议吗？');
    schemaAs=@('双方签字即有效。建议使用规范模板。','不公证也有效。涉及大额财产的建议公证。','属个人财产。婚后共同还贷部分及增值属共同财产。','显失公平的条款可能被认定无效。','婚前财产仍归各自所有，不需要协议也能保护。','不强制但强烈建议，可避免日后纠纷。');
    links=@(@('href="/lihunxieyishu/"','离婚协议书'),@('href="/zufanghetong/"','租赁合同'),@('href="/hezuoxieyi/"','合作协议'))
  },
  @{
    dir='jiaotongshigu'; docId='accident';
    title='交通事故赔偿协议在线生成_交通事故赔偿协议模板_免费填写-法包';
    desc='在线生成规范交通事故赔偿协议，填写事故双方信息、赔偿金额、付款方式等，自动生成完备的交通事故赔偿协议文书。';
    h1='交通事故赔偿协议在线生成 - 填写信息自动出规范赔偿协议';
    breadcrumb='交通事故赔偿';
    faq=@'
<details class="faq-item"><summary>交通事故私了协议是什么？</summary><div class="faq-body">交通事故赔偿协议是事故双方就赔偿事宜达成的书面协议。适用于轻微事故双方协商私了的情形。涉及人员伤亡、酒驾、无证驾驶等情况的，必须报警处理。</div></details>

<details class="faq-item"><summary>赔偿协议必须写的4个条款</summary><div class="faq-body">
<h4>事故经过</h4><p>写明时间、地点、经过、双方车辆信息。</p>
<h4>责任认定</h4><p>写明谁全责、主责、同责。如有交警认定书，注明编号。</p>
<h4>赔偿金额</h4><p>金额大小写同时写明，写清包含哪些项目（医疗费、误工费、修车费等）。</p>
<h4>一次性了结条款</h4><p>必须写"本协议履行后双方就本次事故再无其他争议"。这是防止事后反悔的关键。</p>
</div></details>

<details class="faq-item"><summary>什么情况不能私了</summary><div class="faq-body">
<p style="color:#DC2626;">造成人员伤亡的、酒驾毒驾的、无证驾驶的、肇事逃逸的、对方车辆无保险的——必须报警处理，私了协议可能无效。</p>
</div></details>

<details class="faq-item"><summary>关于交通事故赔偿的常见问题</summary><div class="faq-body">
<h4>私了协议签字后还能反悔吗？</h4><p>一般不能。但存在重大误解或显失公平的可在一年内请求撤销。</p>
<h4>对方不赔钱怎么办？</h4><p>凭私了协议可向法院起诉要求履行赔偿义务。</p>
<h4>对方全责但不签协议怎么办？</h4><p>可报警由交警出具认定书，或直接向法院起诉。</p>
<h4>私了后对方说受伤了怎么办？</h4><p>协议中有"一次性了结"条款且金额合理的，对方需举证新伤情与事故的因果关系。</p>
<h4>交通事故赔偿包括哪些项目？</h4><p>医疗费、误工费、护理费、交通费、营养费、残疾赔偿金、精神损害抚慰金、修车费。</p>
<h4>赔偿协议要公证吗？</h4><p>不强制。金额较大的公证可增强证据效力。</p>
</div></details>
'@; schemaQs=@('私了协议签字后还能反悔吗？','对方不赔钱怎么办？','对方全责但不签协议怎么办？','私了后对方说受伤了怎么办？','交通事故赔偿包括哪些项目？','赔偿协议要公证吗？');
    schemaAs=@('一般不能。重大误解或显失公平的可在一年内请求撤销。','凭私了协议可向法院起诉。','可报警由交警出具认定书或直接起诉。','对方需举证新伤情与事故的因果关系。','医疗费、误工费、护理费、残疾赔偿金、修车费等。','不强制。金额较大的建议公证。');
    links=@(@('href="/minshiqisuzhuang/"','民事起诉状'),@('href="/jietiao/"','借条'),@('href="/zufanghetong/"','租赁合同'))
  }
)

# Process each page
foreach ($p in $pages) {
  $page = $template.Clone()
  $dir = $p.dir; $docId = $p.docId

  # Auto-select doc
  $page = $page -replace "docTypes.find\(d => d\.id === 'iou'\)", "docTypes.find(d => d.id === '$docId')"
  # Title
  $page = $page -replace '<title>借条在线生成_规范借条格式模板_免费填写-法包</title>', "<title>$($p.title)</title>"
  # Description
  $page = $page -replace '<meta name="description" content="在线生成规范借条.*">', "<meta name=`"description`" content=`"$($p.desc)`">"
  # Canonical
  $page = $page -replace 'href="https://fabao99.cn/jietiao/"', "href=`"https://fabao99.cn/$dir/`""
  # H1
  $page = $page -replace '<h1 style="font-size:28px;font-weight:700;color:#0F172A;margin-bottom:24px;">借条在线生成 - 填写信息自动出规范借条</h1>', "<h1 style=`"font-size:28px;font-weight:700;color:#0F172A;margin-bottom:24px;`">$($p.h1)</h1>"
  # Breadcrumb schema
  $page = $page -replace '"name":"借条","item":"https://fabao99.cn/jietiao/"', "`"name`":`"$($p.breadcrumb)`",`"item`":`"https://fabao99.cn/$dir/`""

  # Replace FAQ content
  $seoStart = $page.IndexOf('<details class="faq-item"><summary>借条是什么？</summary>')
  $seoEnd = $page.IndexOf('</details>', $seoStart)
  $seoEnd = $page.IndexOf('</div>', $seoEnd + 1)
  $seoEnd = $page.IndexOf('</div>', $seoEnd + 1)
  $before = $page.Substring(0, $seoStart)
  $after = $page.Substring($seoEnd)
  $page = $before + $p.faq + "`r`n`r`n" + $after

  # Replace FAQ schema questions
  $origQs = @('借条不写身份证号有效吗？','借条用手写还是打印？','没有借条只有转账记录能起诉吗？','借条的诉讼时效是多久？','借条上的利息怎么约定才合法？','朋友借钱没写借条怎么办？')
  for ($i = 0; $i -lt 6; $i++) {
    $page = $page -replace ([regex]::Escape('"name":"' + $origQs[$i] + '"')), ('"name":"' + $p.schemaQs[$i] + '"')
    $page = $page -replace ('"text":"[^"]*"'), ('"text":"' + $p.schemaAs[$i] + '"')
  }

  # Replace related links (3 links)
  $oldLinks = @('/qiantiao/', '/minshiqisuzhuang/', '/hezuoxieyi/')
  $oldTexts = @('欠条', '民事起诉状', '合作协议')
  for ($i = 0; $i -lt 3; $i++) {
    $page = $page -replace "href=`"$($oldLinks[$i])`"", "href=`"$($p.links[$i][0])`""
    $page = $page -replace ">$($oldTexts[$i])<", ">$($p.links[$i][1])<"
  }

  # Save
  New-Item -ItemType Directory -Force "c:\Users\admin\Desktop\lawtools\$dir" | Out-Null
  $page | Out-File -Encoding utf8 "c:\Users\admin\Desktop\lawtools\$dir\index.html"
  Copy-Item 'c:\Users\admin\Desktop\lawtools\jietiao\收款二维码.jpg' "c:\Users\admin\Desktop\lawtools\$dir\收款二维码.jpg" -Force
  Write-Host "Created: $dir"
}

Write-Host "All 9 pages done!"