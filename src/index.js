import Discord from 'discord.js';
import StringTable from 'string-table';
import fetch  from 'node-fetch';


const getDolar = async () => {
    const dolarData = await fetch('https://www.dolarsi.com/api/api.php?type=valoresprincipales')
        .then(res => res.json())
        .then(res => {
            return res.map(item => {
                const  {nombre, compra, venta} = item.casa;

                return {nombre, compra, venta};
                // return `💸 ${nombre} 🛒 $${compra} 💱 $${venta}`;
            })
        });

    const maxLenghts = dolarData.reduce((acc, item) => {
        const {nombre, compra, venta} = item;

        acc.nombre = Math.max(acc.nombre, nombre.length);
        acc.compra = Math.max(acc.compra, compra.length);
        acc.venta = Math.max(acc.venta, venta.length);

        return acc;
    }, {nombre:0, compra:0, venta:0});

    const dolars = dolarData.reduce((acc, item) => {

        const SPACE = ' ';
        const COLUMN_SEPARATOR = ' | ';

        const nombre = item.nombre + SPACE.repeat(maxLenghts.nombre - item.nombre.length);
        const compra = item.compra + SPACE.repeat(maxLenghts.compra - item.compra.length);
        const venta = item.venta + SPACE.repeat(maxLenghts.venta - item.venta.length);

        const str = `💸 ${nombre} ${COLUMN_SEPARATOR} 🛒 $${compra} ${COLUMN_SEPARATOR} 💱 $${venta}`;

        console.log(str)

        acc.push(str);

        return acc;
    }, [])

    return dolars;
}

// REF: https://ziad87.net/intents/
const intents = new Discord.Intents(513);

// Crear Cliente de Discord
const client = new Discord.Client({intents:[intents]});

client.on('ready', () => {
    console.log("Logged in as " + client.user.tag);
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return false;

    if (message.content.startsWith("$dolar")) {
        message.channel.send("Obteniendo el precio del dolar 💸💸");
        const dolars = await getDolar();

        for(const dolar of dolars) {
            message.channel.send(dolar);
        }
    }
});


client.login(process.env.BOT_TOKEN);
