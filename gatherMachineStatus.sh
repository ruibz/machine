echo "host: `hostname | cut -d'.' -f1`"
echo "cpu: `cat /proc/cpuinfo | grep processor | wc -l`"
echo "uptime: `uptime | cut -d',' -f1 | cut -b 14-`"
echo "user: `who | awk '{print $1}' | sort | uniq | sed ':label;N;s/\n/ /;b label'`"
echo "load: `uptime | cut -d ',' -f 3- | cut -d ':' -f 2 | sed 's/^[ \t]*//g'`"

