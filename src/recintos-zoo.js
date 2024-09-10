export class RecintosZoo {
    constructor() {
        this.recintos = [
            { numero: 1, bioma: ['savana'], tamanhoTotal: 10, animais: [{ especie: 'MACACO', quantidade: 3 }] },
            { numero: 2, bioma: ['floresta'], tamanhoTotal: 5, animais: [] },
            { numero: 3, bioma: ['savana', 'rio'], tamanhoTotal: 7, animais: [{ especie: 'GAZELA', quantidade: 1 }] },
            { numero: 4, bioma: ['rio'], tamanhoTotal: 8, animais: [] },
            { numero: 5, bioma: ['savana'], tamanhoTotal: 9, animais: [{ especie: 'LEAO', quantidade: 1 }] },
        ];

        this.animais = {
            'LEAO': { tamanho: 3, biomas: ['savana'], carnivoro: true },
            'LEOPARDO': { tamanho: 2, biomas: ['savana'], carnivoro: true },
            'CROCODILO': { tamanho: 3, biomas: ['rio'], carnivoro: true },
            'MACACO': { tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false },
            'GAZELA': { tamanho: 2, biomas: ['savana'], carnivoro: false },
            'HIPOPOTAMO': { tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false },
        };
    }

    validarEntrada(animal, quantidade) {
        if (!this.animais[animal]) return "Animal inválido";
        if (typeof quantidade !== 'number' || quantidade <= 0) return "Quantidade inválida";
        return null;
    }

    calcularEspacoLivre(recinto) {
        return recinto.tamanhoTotal - recinto.animais.reduce((total, a) => {
            return total + this.animais[a.especie].tamanho * a.quantidade;
        }, 0);
    }

    precisaEspacoExtra(recinto, animal) {
        // Precisamos de espaço extra se já houver animais diferentes no recinto
        return recinto.animais.length > 0 && recinto.animais.some(a => a.especie !== animal);
    }

    verificarRecinto(recinto, animal, quantidade) {
        const { tamanho, biomas, carnivoro } = this.animais[animal];
        const espacoLivre = this.calcularEspacoLivre(recinto);

        // Verifica bioma compatível
        if (!biomas.some(bioma => recinto.bioma.includes(bioma))) return false;

        // Carnívoros só podem estar com a própria espécie
        if (carnivoro && recinto.animais.length > 0 && recinto.animais.some(a => a.especie !== animal)) return false;

        // Verifica regra do hipopótamo (precisa de savana e rio)
        if (animal === 'HIPOPOTAMO' && !(recinto.bioma.includes('savana') && recinto.bioma.includes('rio'))) return false;

        // Calcula espaço necessário, aplicando regra de espaço extra se houver outras espécies
        const espacoExtra = this.precisaEspacoExtra(recinto, animal) ? 1 : 0;
        const espacoNecessario = (tamanho * quantidade) + espacoExtra;

        return espacoNecessario <= espacoLivre;
    }

    analisaRecintos(animal, quantidade) {
        const erro = this.validarEntrada(animal, quantidade);
        if (erro) return { erro, recintosViaveis: null };

        const recintosViaveis = this.recintos
            .filter(recinto => this.verificarRecinto(recinto, animal, quantidade))
            .map(recinto => {
                const espacoLivre = this.calcularEspacoLivre(recinto);
                const espacoExtra = this.precisaEspacoExtra(recinto, animal) ? 1 : 0;
                const tamanhoNecessario = (this.animais[animal].tamanho * quantidade) + espacoExtra;
                return {
                    numero: recinto.numero,
                    espacoLivre: espacoLivre - tamanhoNecessario,
                    espacoTotal: recinto.tamanhoTotal
                };
            })
            .filter(r => r.espacoLivre >= 0) // Filtra recintos que ainda têm espaço livre
            .sort((a, b) => a.numero - b.numero)
            .map(r => `Recinto ${r.numero} (espaço livre: ${r.espacoLivre} total: ${r.espacoTotal})`);

        return recintosViaveis.length > 0
            ? { recintosViaveis }
            : { erro: "Não há recinto viável", recintosViaveis: null };
    }
}
