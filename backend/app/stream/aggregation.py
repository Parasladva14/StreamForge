class TemperatureAggregator:

    def __init__(self):
        self.count = 0
        self.total = 0

    def update(self, temperature):

        self.count += 1

        self.total += temperature

    @property
    def average(self):

        if self.count == 0:
            return 0

        return round(self.total / self.count, 2)