class TemperatureAggregator:
    def __init__(self):
        self.count = 0
        self.total = 0.0
        self.max_temperature = float("-inf")
        self.min_temperature = float("inf")
        self.last_temperature = None

    def update(self, temperature: float):
        self.count += 1
        self.total += temperature
        self.last_temperature = temperature
        if temperature > self.max_temperature:
            self.max_temperature = temperature
        if temperature < self.min_temperature:
            self.min_temperature = temperature

    @property
    def average(self) -> float:
        if self.count == 0:
            return 0.0
        return round(self.total / self.count, 2)

    @property
    def is_critical(self) -> bool:
        return self.last_temperature is not None and self.last_temperature >= 50.0

    @property
    def is_warning(self) -> bool:
        return self.last_temperature is not None and 45.0 <= self.last_temperature < 50.0

    def summary(self) -> dict:
        return {
            "count": self.count,
            "average": self.average,
            "max": self.max_temperature if self.count > 0 else 0.0,
            "min": self.min_temperature if self.count > 0 else 0.0,
            "last": self.last_temperature or 0.0,
        }