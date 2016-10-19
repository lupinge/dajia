<div id="address" class="table-mask active"
    data-widget="hybrid/app/my_point/page/address.js#addressForm">
    <span class="table-desc">恭喜你赢得活动大奖啦！请准确填写以下信息，奖品才能快点投入你的怀抱哟~</span>
    <form data-role="form">
        <div class="table-input">
            <input type="hidden" name="merchandise_id" value="0">
            <input name="receiver_name" type="text" placeholder="请输入收货人姓名（必填）"
            data-rules='[["required","姓名不能为空"]]'
            >

            <hr class="sm-line">
            <input name="contact" type="tel" placeholder="请输入收货人手机号（必填）"
            data-rules='[["required","手机号不能为空"],["phone","手机格式不对"]]'
            ><hr class="sm-line">
            <input name="address" type="text" placeholder="请输入收货地址（必填）"
            data-rules='[["required","收货地址不能为空"]]'
            ><hr class="sm-line">
            <input name="note" type="text" placeholder="请输入QQ或微信号（选填）"><hr class="sm-line">
        </div>
        <div class="dialog-bar mt25">
            <button type="button" style="margin-left:0px;" data-role="cancel" data-action="no" class="btn btn-cancel thin-border">取消</button>
            <button type="submit" data-role="submit" data-action="yes" class="btn btn-confirm ml40">确定</button>
        </div>
    </form>
</div>