
select @mmax:=0.00,@mmax;
select
  dI.entryDate as 'ed',
  @vi:=dI.msg as 'v',
  cast( (@mmax:=if(@mmax<@vi,@vi,@mmax) ) as float) as 'mmaxVal'
from topic_e01Mux_C as dI
group by mmaxVal
order by ed;

select
  dI.entryDate as 'time',
  @vim:=cast( dI.msg as float)*(0.02771809) as 'NewMax',
  @mmax:=if(@mmax<@vim,@vim,@mmax) as 'mmaxVal',
  (@mmax:=@mmax*0.991) as 'dicrees'
from topic_e01Mux_adc0 as dI
where $__unixEpochFilter(dI.entryDate)
group by mmaxVal
order by time;

 ## https://chartio.com/resources/tutorials/how-to-use-if-then-logic-in-sql-server/
select
  'fMsg',
  @a:=1 as 'time' ,
  @m:=1.00 as 'v2',
  (0) as 'nMax'

union all

select
  cast(msg as float) as fMsg,
  entryDate as 'time',
  @a+1,@m:=if( @m<cast(msg as float),cast(msg as float),@m  ) as 'nMax'
from topic_e01Mux_C
group by nMax
limit 3;
