import { useState } from 'react'
import { CreditCard, Plus, Minus, History, TrendingUp, TrendingDown } from 'lucide-react'

interface CreditTransaction {
  id: number
  type: 'earned' | 'spent' | 'refunded'
  amount: number
  description: string
  date: string
  eventTitle?: string
}

export default function CreditsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'month' | 'week'>('all')

  const currentCredits = 8
  const totalEarned = 15
  const totalSpent = 7

  const transactions: CreditTransaction[] = [
    {
      id: 1,
      type: 'earned',
      amount: 2,
      description: 'Participation à un événement',
      date: '2024-01-15',
      eventTitle: 'Match de foot amical'
    },
    {
      id: 2,
      type: 'spent',
      amount: 1,
      description: 'Participation à un événement',
      date: '2024-01-14',
      eventTitle: 'Course à pied matinale'
    },
    {
      id: 3,
      type: 'earned',
      amount: 3,
      description: 'Organisation d\'un événement',
      date: '2024-01-12',
      eventTitle: 'Tennis en double'
    },
    {
      id: 4,
      type: 'spent',
      amount: 2,
      description: 'Participation à un événement',
      date: '2024-01-10',
      eventTitle: 'Basketball 3v3'
    },
    {
      id: 5,
      type: 'refunded',
      amount: 1,
      description: 'Remboursement - événement annulé',
      date: '2024-01-08',
      eventTitle: 'Volleyball plage'
    }
  ]

  const periods = [
    { id: 'all', label: 'Toutes les périodes' },
    { id: 'month', label: 'Ce mois' },
    { id: 'week', label: 'Cette semaine' }
  ]

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earned': return <Plus className="h-4 w-4 text-green-600" />
      case 'spent': return <Minus className="h-4 w-4 text-red-600" />
      case 'refunded': return <Plus className="h-4 w-4 text-blue-600" />
      default: return <CreditCard className="h-4 w-4 text-gray-600" />
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'earned': return 'text-green-600'
      case 'spent': return 'text-red-600'
      case 'refunded': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  const getTransactionPrefix = (type: string) => {
    switch (type) {
      case 'earned': return '+'
      case 'spent': return '-'
      case 'refunded': return '+'
      default: return ''
    }
  }

  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date)
    const now = new Date()
    
    if (selectedPeriod === 'month') {
      const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
      return transactionDate >= monthAgo
    } else if (selectedPeriod === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      return transactionDate >= weekAgo
    }
    
    return true
  })

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mes crédits</h1>
        <p className="text-gray-600 mt-2">Gérez votre solde et suivez vos transactions</p>
      </div>

      {/* Vue d'ensemble des crédits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="h-8 w-8 text-primary-600" />
          </div>
          <div className="text-3xl font-bold text-primary-600 mb-2">{currentCredits}</div>
          <div className="text-gray-600">Crédits disponibles</div>
        </div>
        
        <div className="card text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-600 mb-2">{totalEarned}</div>
          <div className="text-gray-600">Total gagnés</div>
        </div>
        
        <div className="card text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingDown className="h-8 w-8 text-red-600" />
          </div>
          <div className="text-3xl font-bold text-red-600 mb-2">{totalSpent}</div>
          <div className="text-gray-600">Total dépensés</div>
        </div>
      </div>

      {/* Filtres et historique */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <History className="h-5 w-5 mr-2" />
            Historique des transactions
          </h2>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Période :</span>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as 'all' | 'month' | 'week')}
              className="input-field min-w-[150px]"
            >
              {periods.map(period => (
                <option key={period.id} value={period.id}>
                  {period.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Liste des transactions */}
        <div className="space-y-4">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8">
              <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune transaction</h3>
              <p className="text-gray-600">Aucune transaction trouvée pour cette période</p>
            </div>
          ) : (
            filteredTransactions.map(transaction => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  
                  <div>
                    <div className="font-medium text-gray-900">
                      {transaction.description}
                    </div>
                    {transaction.eventTitle && (
                      <div className="text-sm text-gray-600">
                        {transaction.eventTitle}
                      </div>
                    )}
                    <div className="text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>
                
                <div className={`text-right ${getTransactionColor(transaction.type)}`}>
                  <div className="text-lg font-semibold">
                    {getTransactionPrefix(transaction.type)}{transaction.amount} crédit{transaction.amount > 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Informations sur les crédits */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Comment gagner des crédits ?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Gagner des crédits :</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Participer à des événements (+1 à +3 crédits)</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Organiser des événements (+2 à +5 crédits)</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Inviter des amis (+1 crédit par ami)</span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Utiliser des crédits :</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Participer à des événements (-1 à -3 crédits)</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Accéder à des événements premium</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Réserver des équipements</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 