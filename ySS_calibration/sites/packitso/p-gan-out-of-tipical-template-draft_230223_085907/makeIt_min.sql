
select @mmin:=0.00,@mmin;
select
  dI.entryDate as 'time',
  @vi:=dI.msg as 'v',
  cast( (@mmin:=if(@mmin>@vi,@vi,if(@mmin=0.00,@vi,@mmin)) ) as float) as 'mminVal'
from topic_e01Mux_adc0 as dI
group by mminVal
order by time;
